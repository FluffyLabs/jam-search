import {
  type SQL,
  and,
  cosineDistance,
  desc,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import OpenAI from "openai";
import { z } from "zod";
import { db } from "../db/db.js";
import { discordsTable, graypapersTable } from "../db/schema.js";

const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchDiscordsRequestSchema = z.object({
  q: z.string(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  filter_from: z.string().optional(),
  filter_since_gp: z.string().optional(),
  filter_before: z.string().optional(),
  filter_after: z.string().optional(),
  channelId: z.string().optional(),
  searchMode: z.enum(["fuzzy", "semantic", "strict"]).default("strict"),
});

export async function searchDiscords(
  data: z.infer<typeof searchDiscordsRequestSchema>
) {
  // Initialize additional filter conditions
  const whereConditions = [];

  // Add filter conditions based on parameters
  if (data.filter_from) {
    const senderName = data.filter_from;
    whereConditions.push(
      sql`id @@@ paradedb.regex('sender', ${`${escapeRegExp(senderName)}.*`})`
    );
  }

  // Add filter condition for channelId
  if (data.channelId) {
    whereConditions.push(
      sql`id @@@ paradedb.match('channelid', ${data.channelId})`
    );
  }

  // Add filter condition for date range
  if (data.filter_since_gp || data.filter_before || data.filter_after) {
    let startDate = new Date("1970-01-01");
    let endDate = new Date();

    if (data.filter_before && !Number.isNaN(new Date(data.filter_before))) {
      endDate = new Date(data.filter_before);
    }

    if (data.filter_after && !Number.isNaN(new Date(data.filter_after))) {
      startDate = new Date(data.filter_after);
    }

    if (data.filter_since_gp) {
      // Look up the timestamp for the specified graypaper version
      const gpVersionResult = await db
        .select({ timestamp: graypapersTable.timestamp })
        .from(graypapersTable)
        .where(ilike(graypapersTable.version, data.filter_since_gp))
        .orderBy(desc(graypapersTable.timestamp))
        .limit(1);

      if (gpVersionResult.length > 0) {
        // Use the timestamp from graypaper to filter messages
        const gpTimestamp = gpVersionResult[0].timestamp;
        startDate = gpTimestamp;
      } else {
        // If graypaper version not found, return empty results
        return {
          results: [],
          total: 0,
          page: data.page,
          pageSize: data.pageSize,
          error: `Graypaper version ${data.filter_since_gp} not found`,
        };
      }
    }

    whereConditions.push(
      sql.raw(
        `timestamp @@@ '[${startDate.toISOString()} TO ${endDate.toISOString()}]'`
      )
    );
  }

  let orderBy: SQL = sql`paradedb.score(id) DESC, timestamp DESC, id`;
  let similarity = sql<number>`1`;

  const searchTerms = data.q.toLowerCase().split(/\s+/);
  switch (data.searchMode) {
    case "strict": {
      whereConditions.push(
        or(
          ilike(discordsTable.content, `%${data.q}%`),
          ilike(discordsTable.sender, `${data.q}%`)
        )
      );
      orderBy = sql`timestamp DESC, id`;
      break;
    }

    case "fuzzy": {
      whereConditions.push(
        sql`id @@@ paradedb.boolean(should => ARRAY[
          ${
            searchTerms.length > 1
              ? sql`paradedb.boost(10, paradedb.phrase('content', ARRAY[${sql.join(
                  searchTerms.map((term) => sql`${term}`),
                  sql.raw(", ")
                )}])),`
              : sql``
          }
          paradedb.boost(2, paradedb.match('content', ${data.q})),
          paradedb.match('sender', ${data.q})
        ])`
      );
      break;
    }
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
          discordsTable.embedding,
          embedding
        )}) AS similarity`;

        orderBy = sql`similarity DESC, timestamp DESC, id`;
        whereConditions.push(
          sql`${cosineDistance(discordsTable.embedding, embedding)} < 0.8`
        );
      } catch (error) {
        console.error("Error generating embedding for search query:", error);
        // Fallback to standard search if embedding fails
        whereConditions.push(sql`id @@@ paradedb.match('content', ${data.q})`);
      }
      break;
    default:
      throw new Error(`Unhandled search mode: ${data.searchMode}`);
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(discordsTable)
    .where(and(...whereConditions));

  const query = db
    .select({
      messageId: discordsTable.messageId,
      channelId: discordsTable.channelId,
      sender: discordsTable.sender,
      authorId: discordsTable.authorId,
      content: discordsTable.content,
      timestamp: discordsTable.timestamp,
      similarity,
      score: sql<number>`paradedb.score(id)`,
    })
    .from(discordsTable)
    .where(and(...whereConditions))
    .orderBy(orderBy)
    .offset((data.page - 1) * data.pageSize)
    .limit(data.pageSize);

  const results = await query;

  const total = Number(countResult[0].count);
  console.log(`Discord search query found ${total} results`);

  return {
    results,
    total,
    page: data.page,
    pageSize: data.pageSize,
  };
}
