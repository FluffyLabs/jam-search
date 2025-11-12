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
import { env } from "../env.js";
import {paradeMatch, SIMILARITY_THRESHOLD, similarityMatch, timeConditions} from "./common.js";

export const searchDiscordsRequestSchema = z.object({
  q: z.string(),
  e: z.array(z.number()).default([]),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  filter_from: z.string().optional(),
  filter_since_gp: z.string().optional(),
  filter_before: z.string().optional(),
  filter_after: z.string().optional(),
  channelId: z.string().optional(),
  threadId: z.string().optional(),
});

export async function searchDiscords(
  data: z.infer<typeof searchDiscordsRequestSchema>
) {
  const time = await timeConditions('timestamp', data.filter_since_gp, data.filter_before, data.filter_after);
  if (time.ok === false) {
    return {
      results: [],
      total: 0,
      page: data.page,
      pageSize: data.pageSize,
      error: time.error ?? 'No data.'
    };
  }

  // Initialize additional filter conditions
  const whereConditions = [
    // Add filter conditions based on parameters
    data.filter_from ? sql`id @@@ ${paradeMatch('sender', data.filter_from)}` : undefined,
    // channelid
    data.channelId ? sql`id @@@ ${paradeMatch('channel_id', data.channelId)}` : undefined,
    data.threadId ? sql`id @@@ ${paradeMatch('thread_id', data.threadId)}` : undefined,
    // time-based
    ...time.where,
    // matches
    or(
      // standard search using paradedb
      sql`id @@@ paradedb.boolean(should => ARRAY[
        ${paradeMatch('sender', data.q, 2.0)},
        ${paradeMatch('content', data.q)}
      ])`,
      // embedding search if embedding is provided (otherwise always false)
      sql<boolean>`similarity > ${SIMILARITY_THRESHOLD}`
    ),
  ];

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(discordsTable)
    .where(and(...whereConditions));

  const total = Number(countResult[0].count);
  console.log(`Discord search query found ${total} results`);

  const query = db
    .select({
      messageId: discordsTable.messageId,
      channelId: discordsTable.channelId,
      threadId: discordsTable.threadId,
      serverId: discordsTable.serverId,
      sender: discordsTable.sender,
      authorId: discordsTable.authorId,
      content: discordsTable.content,
      timestamp: discordsTable.timestamp,
      similarity: similarityMatch(discordsTable.embedding, data.e),
      score: sql<number>`paradedb.score(id)`,
    })
    .from(discordsTable)
    .where(and(...whereConditions))
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
