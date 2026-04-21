import { z } from "zod";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";
import { searchDocs } from "../data/searchIndex.js";
import { embeddingSchema, resolveEmbedding } from "./common.js";

export const searchPagesRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  site: z.string().optional(),
  contentKind: z.enum(["issue", "pr", "discussion", "code"]).optional(),
  language: z.string().optional(),
});

export async function searchPages(
  data: z.infer<typeof searchPagesRequestSchema>,
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

  const where: Record<string, unknown> = {};
  if (data.site) where.site = { eq: data.site };
  if (data.contentKind) where.contentKind = { eq: data.contentKind };
  if (data.language) where.language = { eq: data.language };

  const results = searchDocs(db, {
    term: data.q,
    embedding: embedding.length > 0 ? embedding : undefined,
    type: "page",
    limit: data.pageSize,
    offset: (data.page - 1) * data.pageSize,
    where,
    properties: ["content", "title"] as const,
    boost: { title: 2, content: 1 },
  });

  console.log(`Pages search query found ${results.count} results`);

  return {
    results: results.hits.map((hit) => ({
      id: hit.id,
      url: hit.document.url,
      title: hit.document.title,
      content: hit.document.content,
      site: hit.document.site,
      contentKind: hit.document.contentKind,
      language: hit.document.language,
      lastModified: hit.document.timestamp
        ? new Date(hit.document.timestamp)
        : null,
      createdAt: hit.document.timestamp
        ? new Date(hit.document.timestamp)
        : null,
      similarity: hit.score,
      score: hit.score,
    })),
    total: results.count,
    page: data.page,
    pageSize: data.pageSize,
  };
}
