import { and, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/db.js";
import { graypaperSectionsTable } from "../db/schema.js";
import {
  embeddingSchema,
  paradeMatch,
  similarityMatch,
  similarityWhere,
} from "./common.js";

export const searchGraypaperRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
});

export async function searchGraypaper(
  data: z.infer<typeof searchGraypaperRequestSchema>
) {
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
    or(
      // standard search using paradedb
      paradeMatch(
        [
          ["title", 2.0],
          ["text", 1.0],
        ],
        data.q
      ),
      // embedding search if embedding is provided
      similarityWhere(graypaperSectionsTable.embedding, data.e)
    ),
  ];

  // Get total count of matching rows
  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(graypaperSectionsTable)
    .where(and(...whereConditions));

  const total = Number(countResult[0].count);
  console.log(`Graypapers search query found ${total} results`);

  // Get paginated results
  const results = await db
    .select({
      id: graypaperSectionsTable.id,
      title: graypaperSectionsTable.title,
      text: graypaperSectionsTable.text,
      similarity: similarityMatch(graypaperSectionsTable.embedding, data.e),
      score: sql<number>`paradedb.score(id) AS score`,
    })
    .from(graypaperSectionsTable)
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
