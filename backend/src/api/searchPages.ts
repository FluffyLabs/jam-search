import { type SQL, and, cosineDistance, ilike, or, sql } from "drizzle-orm";
import OpenAI from "openai";
import { z } from "zod";
import { db } from "../db/db.js";
import { pagesTable } from "../db/schema.js";

export const searchPagesRequestSchema = z.object({
  q: z.string(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  searchMode: z.enum(["fuzzy", "semantic", "strict"]).default("strict"),
  site: z.string().optional(),
});

export async function searchPages(
  data: z.infer<typeof searchPagesRequestSchema>
) {
  // Base search condition
  const whereConditions = [];

  // Add site filter if provided
  if (data.site) {
    whereConditions.push(ilike(pagesTable.site, `%${data.site}%`));
  }

  let orderBy: SQL = sql`paradedb.score(id) DESC, id`;
  let similarity = sql<number>`1`;

  const searchTerms = data.q.toLowerCase().split(/\s+/);
  switch (data.searchMode) {
    case "strict": {
      whereConditions.push(
        or(
          ilike(pagesTable.title, `%${data.q}%`),
          ilike(pagesTable.content, `%${data.q}%`)
        )
      );
      orderBy = sql`id`;
      break;
    }
    case "fuzzy":
      whereConditions.push(sql`id @@@ paradedb.boolean(should => ARRAY[
        ${
          searchTerms.length > 1
            ? sql`
          paradedb.boost(20, paradedb.phrase('title', ARRAY[${sql.join(
            searchTerms.map((term) => sql`${term}`),
            sql.raw(", ")
          )}])),
          paradedb.boost(10, paradedb.phrase('content', ARRAY[${sql.join(
            searchTerms.map((term) => sql`${term}`),
            sql.raw(", ")
          )}])),`
            : sql``
        }
        paradedb.boost(2, paradedb.match('title', ${data.q})),
        paradedb.match('content', ${data.q})
      ])`);
      break;
    case "semantic":
      // Get embeddings for the query
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: data.q,
          dimensions: 1536,
        });

        const embedding = response.data[0].embedding;
        similarity = sql<number>`1 - (${cosineDistance(
          pagesTable.embedding,
          embedding
        )}) AS similarity`;

        orderBy = sql`similarity DESC, id DESC`;
        whereConditions.push(
          sql`${cosineDistance(pagesTable.embedding, embedding)} < 0.8`
        );
      } catch (error) {
        console.error("Error generating embedding for search query:", error);
        // Fallback to standard search if embedding fails
        whereConditions.push(
          sql`id @@@ paradedb.boolean(should => ARRAY[
            paradedb.match('title', ${data.q}),
            paradedb.match('content', ${data.q})
          ])`
        );
      }
      break;
    default:
      throw new Error(`Unhandled search mode: ${data.searchMode}`);
  }

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
      similarity,
      score: sql<number>`paradedb.score(id)`,
    })
    .from(pagesTable)
    .where(and(...whereConditions))
    .orderBy(orderBy)
    .offset((data.page - 1) * data.pageSize)
    .limit(data.pageSize);

  return {
    results,
    total,
    page: data.page,
    pageSize: data.pageSize,
  };
}
