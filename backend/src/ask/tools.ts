import { searchDiscords } from "../api/searchDiscords.js";
import { searchGraypaper } from "../api/searchGraypapers.js";
import { searchMessages } from "../api/searchMessages.js";
import { searchPages } from "../api/searchPages.js";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";
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

const noOpEmbeddingCache: EmbeddingCache = {
  store: () => "",
  retrieve: () => undefined,
  clear: () => {},
};

function truncate(text: string, max = 500): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export async function executeSearchAll(
  args: { query: string; limit?: number },
  db: SearchDB,
  dataDir: string
): Promise<UnifiedSearchResult[]> {
  const limit = args.limit ?? 10;
  const [pages, discord, matrix, graypaper] = await Promise.all([
    searchPages(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
    searchDiscords(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
    searchMessages(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
    searchGraypaper(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
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
