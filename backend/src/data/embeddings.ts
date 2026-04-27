import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import OpenAI from "openai";
import type { SearchDoc } from "./searchIndex.js";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const MAX_ITEMS_PER_BATCH = 500; // Keep batches small for faster individual requests
// OpenAI enforces 300k tokens per request for text-embedding-3-*; stay well under
// to absorb the inaccuracy of the chars/4 token estimate.
const MAX_TOKENS_PER_BATCH = 250_000;
// Rough heuristic: ~4 chars per token for English/code. Conservative for safety.
const CHARS_PER_TOKEN = 4;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

interface EmbeddingsCache {
  [key: string]: number[];
}

function embeddingKey(doc: SearchDoc): string {
  if (doc.messageId && doc.filePath) {
    return `${doc.filePath}:${doc.messageId}`;
  }
  if (doc.contentKind === "code" && doc.content) {
    const sha = createHash("sha256").update(doc.content, "utf-8").digest("hex");
    return `code:${sha}`;
  }
  return doc.filePath || doc.url || doc.id || "";
}

function embeddingText(doc: SearchDoc): string {
  const parts: string[] = [];
  if (doc.title) parts.push(doc.title);
  if (doc.sender) parts.push(`${doc.sender}:`);
  if (doc.content) parts.push(doc.content.slice(0, 20000));
  return parts.join("\n");
}

interface PendingEmbedding {
  doc: SearchDoc;
  key: string;
  text: string;
}

export function buildBatches(
  items: PendingEmbedding[],
  maxItems: number = MAX_ITEMS_PER_BATCH,
  maxTokens: number = MAX_TOKENS_PER_BATCH
): PendingEmbedding[][] {
  const batches: PendingEmbedding[][] = [];
  let current: PendingEmbedding[] = [];
  let currentTokens = 0;

  for (const item of items) {
    const tokens = estimateTokens(item.text);
    const wouldExceed =
      current.length >= maxItems ||
      (current.length > 0 && currentTokens + tokens > maxTokens);

    if (wouldExceed) {
      batches.push(current);
      current = [];
      currentTokens = 0;
    }

    current.push(item);
    currentTokens += tokens;
  }

  if (current.length > 0) {
    batches.push(current);
  }

  return batches;
}

export function loadEmbeddingsCache(cacheDir: string): EmbeddingsCache {
  const cachePath = path.join(cacheDir, "embeddings.json");
  if (!fs.existsSync(cachePath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(cachePath, "utf-8");
    return JSON.parse(raw) as EmbeddingsCache;
  } catch (error) {
    console.warn("Failed to load embeddings cache, starting fresh:", error);
    return {};
  }
}

export function saveEmbeddingsCache(
  cacheDir: string,
  cache: EmbeddingsCache
): void {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const cachePath = path.join(cacheDir, "embeddings.json");
  fs.writeFileSync(cachePath, JSON.stringify(cache), "utf-8");
}

export async function generateEmbeddings(
  docs: SearchDoc[],
  cacheDir: string,
  openaiApiKey: string
): Promise<void> {
  const cache = loadEmbeddingsCache(cacheDir);
  const cachedCount = Object.keys(cache).length;
  console.log(`Loaded ${cachedCount} cached embeddings`);

  // Find docs that need embeddings
  const needsEmbedding: { doc: SearchDoc; key: string; text: string }[] = [];
  let cachedHits = 0;

  for (const doc of docs) {
    const key = embeddingKey(doc);
    if (!key) continue;

    if (cache[key]) {
      doc.embedding = cache[key];
      cachedHits++;
    } else {
      const text = embeddingText(doc);
      if (text.trim()) {
        needsEmbedding.push({ doc, key, text });
      }
    }
  }

  console.log(
    `Embeddings: ${cachedHits} from cache, ${needsEmbedding.length} to generate`
  );

  if (needsEmbedding.length === 0) {
    return;
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

  // Build batches that respect both an item-count cap and an estimated-token
  // cap. The token cap protects against OpenAI's 300k-tokens-per-request limit,
  // which a fixed item count cannot — a single 20k-char doc can be ~5k tokens.
  const batches = buildBatches(needsEmbedding);

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    const batchNum = batchIdx + 1;

    console.log(
      `Generating embeddings batch ${batchNum}/${batches.length} (${batch.length} items)...`
    );

    try {
      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch.map((b) => b.text),
        dimensions: EMBEDDING_DIMENSIONS,
      });

      for (let j = 0; j < response.data.length; j++) {
        const embedding = response.data[j].embedding;
        const { doc, key } = batch[j];
        doc.embedding = embedding;
        cache[key] = embedding;
      }
    } catch (error) {
      console.error(
        `Failed to generate embeddings for batch ${batchNum}:`,
        error
      );
      // Continue without embeddings for this batch — fulltext search still works
    }
  }

  // Save updated cache
  saveEmbeddingsCache(cacheDir, cache);
  console.log(
    `Embeddings cache updated: ${Object.keys(cache).length} total entries`
  );
}
