import { getByID } from "@orama/orama";
import OpenAI from "openai";
import { searchDiscords } from "../api/searchDiscords.js";
import { searchGraypaper } from "../api/searchGraypapers.js";
import { searchMessages } from "../api/searchMessages.js";
import { searchPages } from "../api/searchPages.js";
import { embeddingCache } from "../cache/embeddingCache.js";
import type { DocType, SearchDB, SearchDoc } from "../data/searchIndex.js";
import type { SourceType } from "./types.js";

export interface UnifiedSearchResult {
  id: string;
  sourceType: SourceType;
  preview: string;
  title?: string;
  url?: string;
  sender?: string;
  timestamp?: number | null;
  score?: number;
}

/**
 * Compute an embedding for the given query using OpenAI.
 * Returns null if the API key is missing/empty or if the request fails.
 */
async function computeQueryEmbedding(query: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      dimensions: 1536,
    });
    return response.data[0].embedding;
  } catch (err) {
    console.warn("[tools] Failed to compute query embedding, falling back to fulltext-only:", err);
    return null;
  }
}

function truncate(text: string, max = 500): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export async function executeSearchAll(
  args: { query: string; limit?: number },
  db: SearchDB,
  dataDir: string
): Promise<UnifiedSearchResult[]> {
  const limit = args.limit ?? 10;

  // Attempt to compute a query embedding for hybrid (text + vector) search.
  // Falls back to fulltext-only if the API key is absent or the call fails.
  const embedding = await computeQueryEmbedding(args.query);
  const embeddingKey = embedding ? embeddingCache.store(embedding) : "";

  const [pages, discord, matrix, graypaper] = await Promise.all([
    searchPages(
      { q: args.query, e: embeddingKey, page: 1, pageSize: limit },
      embeddingCache,
      db,
      dataDir
    ),
    searchDiscords(
      { q: args.query, e: embeddingKey, page: 1, pageSize: limit },
      embeddingCache,
      db,
      dataDir
    ),
    searchMessages(
      { q: args.query, e: embeddingKey, page: 1, pageSize: limit },
      embeddingCache,
      db,
      dataDir
    ),
    searchGraypaper(
      { q: args.query, e: embeddingKey, page: 1, pageSize: limit },
      embeddingCache,
      db,
      dataDir
    ),
  ]);

  const out: UnifiedSearchResult[] = [];
  for (const r of pages.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "page",
      preview: truncate(r.content),
      title: r.title,
      url: r.url,
      timestamp: r.createdAt ? new Date(r.createdAt).getTime() : null,
      score: r.score,
    });
  }
  for (const r of discord.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "discord",
      preview: truncate(r.content),
      sender: r.sender,
      timestamp: r.timestamp ? new Date(r.timestamp).getTime() : null,
      score: r.score,
    });
  }
  for (const r of matrix.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "matrix",
      preview: truncate(r.content),
      sender: r.sender,
      timestamp: r.timestamp ? new Date(r.timestamp).getTime() : null,
      score: r.score,
    });
  }
  for (const r of graypaper.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "graypaper",
      preview: truncate(r.text ?? ""),
      title: r.title,
      score: r.score,
    });
  }
  return out;
}

export interface FullDocument {
  id: string;
  sourceType: SourceType;
  content: string;
  title?: string;
  url?: string;
  sender?: string;
  channelName?: string;
  roomName?: string;
  timestamp?: number | null;
}

function docTypeToSourceType(type: DocType): SourceType {
  switch (type) {
    case "graypaper_section":
    case "graypaper_version":
      return "graypaper";
    case "discord":
      return "discord";
    case "matrix":
      return "matrix";
    case "page":
      return "page";
  }
}

export async function executeGetFullDocument(
  args: { id: string },
  db: SearchDB
): Promise<FullDocument | null> {
  const doc = (await getByID(db, args.id)) as SearchDoc | undefined;
  if (!doc) return null;
  return {
    id: args.id,
    sourceType: docTypeToSourceType(doc.type),
    content: doc.content,
    title: doc.title,
    url: doc.url,
    sender: doc.sender,
    channelName: doc.channelName,
    roomName: doc.roomName,
    timestamp: doc.timestamp ?? null,
  };
}

/**
 * Tool definitions in OpenAI chat-completions tool format. OpenRouter accepts
 * these unchanged. Only two tools: unified search + full-doc fetch.
 */
export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "search_all",
      description:
        "Search across all indexed knowledge sources (graypaper, discord, matrix, pages). Returns up to `limit` result chunks with a stable `id`, a `sourceType`, and a short preview of the content. Use this first to discover relevant material; follow up with get_full_document if a preview is insufficient.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Natural-language or keyword query.",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 20,
            default: 10,
            description: "Max results per source (so up to 4 × limit total).",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_full_document",
      description:
        "Fetch the full markdown of a single document by the `id` returned from search_all. Use when a search preview is insufficient to answer the question.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The `id` from a search_all result.",
          },
        },
        required: ["id"],
      },
    },
  },
];
