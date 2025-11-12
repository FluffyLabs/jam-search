import { and, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/db.js";
import { pagesTable } from "../db/schema.js";
import {paradeMatch, SIMILARITY_THRESHOLD, similarityMatch} from "./common.js";

export const searchPagesRequestSchema = z.object({
  q: z.string(),
  e: z.array(z.number()).default([]),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  site: z.string().optional(),
});

export async function searchPages(
  data: z.infer<typeof searchPagesRequestSchema>
) {
  // Base search condition
  const whereConditions = [
    // Add site filter if provided
    data.site ? ilike(pagesTable.site, `%${data.site}%`) : undefined,
    // matches
    or(
      // standard search using paradedb
      sql<boolean>`id @@@ paradedb.boolean(should => ARRAY[
        ${paradeMatch('title', data.q, 2.0)},
        ${paradeMatch('content', data.q)}
      ])`,
      // embedding search if embedding is provided (otherwise always false)
      sql<boolean>`similarity > ${SIMILARITY_THRESHOLD}`
    )
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
      similarity: similarityMatch(pagesTable.embedding, data.e),
      score: sql<number>`paradedb.score(id)`,
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
