import { and, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import { db } from "../db/db.js";
import { pagesTable } from "../db/schema.js";
import {
  embeddingSchema,
  paradeMatch,
  resolveEmbedding,
  similarityMatch,
  similarityWhere,
} from "./common.js";

export const searchPagesRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  site: z.string().optional(),
});

export async function searchPages(
  data: z.infer<typeof searchPagesRequestSchema>,
  cache: EmbeddingCache
) {
  // Resolve embedding from cache ID or base64
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

  // Base search condition
  const whereConditions = [
    // Add site filter if provided
    data.site ? ilike(pagesTable.site, `%${data.site}%`) : undefined,
    // matches
    or(
      // standard search using paradedb
      paradeMatch(
        [
          ["title", 2.0],
          ["content", 1.0],
        ],
        data.q
      ),
      // embedding search if embedding is provided
      similarityWhere(pagesTable.embedding, embedding)
    ),
  ];

  // Get total count of matching rows
  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(pagesTable)
    .where(and(...whereConditions));

  const total = Number(countResult[0].count);
  console.log(`Pages search query found ${total} results`);

  // Get paginated results
  const results = await db
    .select({
      id: pagesTable.id,
      url: pagesTable.url,
      title: pagesTable.title,
      content: pagesTable.content,
      site: pagesTable.site,
      lastModified: pagesTable.lastModified,
      createdAt: pagesTable.created_at,
      similarity: similarityMatch(pagesTable.embedding, embedding),
      score: sql<number>`paradedb.score(id) AS score`,
    })
    .from(pagesTable)
    .where(and(...whereConditions))
    .orderBy(sql`similarity DESC, score DESC, id`)
    .offset((data.page - 1) * data.pageSize)
    .limit(data.pageSize);

  return {
    results,
    total,
    page: data.page,
    pageSize: data.pageSize,
  };
}
