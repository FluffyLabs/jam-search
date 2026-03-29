import { z } from "zod";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";
import { searchDocs } from "../data/searchIndex.js";
import { embeddingSchema, resolveEmbedding } from "./common.js";

export const searchGraypaperRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
});

export async function searchGraypaper(
  data: z.infer<typeof searchGraypaperRequestSchema>,
  cache: EmbeddingCache,
  db: SearchDB,
  _dataDir: string
) {
  const embedding = resolveEmbedding(data.e, cache);

  if (data.q.trim().length === 0) {
    return {
      results: [],
      total: 0,
      page: data.page,
      pageSize: data.pageSize,
      error: "No query provided.",
    };
  }

  const results = searchDocs(db, {
    term: data.q,
    embedding: embedding.length > 0 ? embedding : undefined,
    type: "graypaper_section",
    limit: data.pageSize,
    offset: (data.page - 1) * data.pageSize,
    properties: ["content", "title"] as const,
    boost: { title: 2, content: 1 },
  });

  console.log(`Graypapers search query found ${results.count} results`);

  return {
    results: results.hits.map((hit) => ({
      id: hit.id,
      title: hit.document.title,
      text: hit.document.content,
      similarity: hit.score,
      score: hit.score,
    })),
    total: results.count,
    page: data.page,
    pageSize: data.pageSize,
  };
}
