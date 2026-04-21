import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import OpenAI from "openai";
import type { SearchDoc } from "./searchIndex.js";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 500; // Keep batches small for faster individual requests

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

  // Process in batches
  for (let i = 0; i < needsEmbedding.length; i += BATCH_SIZE) {
    const batch = needsEmbedding.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(needsEmbedding.length / BATCH_SIZE);

    console.log(
      `Generating embeddings batch ${batchNum}/${totalBatches} (${batch.length} items)...`
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
