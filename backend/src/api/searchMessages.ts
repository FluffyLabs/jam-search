import { and, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/db.js";
import { messagesTable } from "../db/schema.js";
import {
  embeddingSchema,
  paradeMatch,
  similarityMatch,
  similarityWhere,
  simpleParadeMatch,
  timeConditions,
} from "./common.js";

export const searchMessagesRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  filter_from: z.string().optional(),
  filter_since_gp: z.string().optional(),
  filter_before: z.string().optional(),
  filter_after: z.string().optional(),
  channelId: z.string().optional(),
});

export async function searchMessages(
  data: z.infer<typeof searchMessagesRequestSchema>
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

  // Add filter condition for date range
  const time = await timeConditions(
    "timestamp",
    data.filter_since_gp,
    data.filter_before,
    data.filter_after
  );
  if (time.ok === false) {
    return {
      results: [],
      total: 0,
      page: data.page,
      pageSize: data.pageSize,
      error: time.error ?? "No data.",
    };
  }

  // Initialize additional filter conditions
  const whereConditions = [
    // Add filter conditions based on parameters
    data.filter_from
      ? sql`id @@@ ${simpleParadeMatch("sender", data.filter_from)}`
      : undefined,
    // channelid
    data.channelId
      ? sql`id @@@ ${simpleParadeMatch("roomid", data.channelId)}`
      : undefined,
    // time-based
    ...time.where,
    // matches
    or(
      // standard search using paradedb
      paradeMatch(
        [
          ["sender", 2.0],
          ["content", 1.0],
        ],
        data.q
      ),
      // embedding search if embedding is provided
      similarityWhere(messagesTable.embedding, data.e)
    ),
  ];

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(messagesTable)
    .where(and(...whereConditions));

  const total = Number(countResult[0].count);
  console.log(`Message search query found ${total} results`);

  const query = db
    .select({
      id: messagesTable.id,
      messageId: messagesTable.messageId,
      sender: messagesTable.sender,
      content: messagesTable.content,
      timestamp: messagesTable.timestamp,
      roomId: messagesTable.roomId,
      similarity: similarityMatch(messagesTable.embedding, data.e),
      score: sql<number>`paradedb.score(id) AS score`,
    })
    .from(messagesTable)
    .where(and(...whereConditions))
    // order by similarity first, then paradedb score
    .orderBy(sql`similarity DESC, score DESC, timestamp DESC, id`)
    .offset((data.page - 1) * data.pageSize)
    .limit(data.pageSize);
  const results = await query;

  return {
    results,
    total,
    page: data.page,
    pageSize: data.pageSize,
  };
}
