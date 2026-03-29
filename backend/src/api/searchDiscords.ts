import { z } from "zod";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";
import { searchDocs } from "../data/searchIndex.js";
import { embeddingSchema, resolveEmbedding, timeConditions } from "./common.js";

export const searchDiscordsRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
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
  data: z.infer<typeof searchDiscordsRequestSchema>,
  cache: EmbeddingCache,
  db: SearchDB,
  dataDir: string
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

  const time = await timeConditions(
    dataDir,
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

  const where: Record<string, unknown> = { ...time.where };
  if (data.channelId) {
    where.channelId = { eq: data.channelId };
  }
  if (data.threadId) {
    where.threadId = { eq: data.threadId };
  }

  const results = searchDocs(db, {
    term: data.filter_from ? `${data.q} ${data.filter_from}` : data.q,
    embedding: embedding.length > 0 ? embedding : undefined,
    type: "discord",
    limit: data.pageSize,
    offset: (data.page - 1) * data.pageSize,
    where,
    properties: ["content", "sender"] as const,
    boost: { sender: 2, content: 1 },
  });

  console.log(`Discord search query found ${results.count} results`);

  return {
    results: results.hits.map((hit) => ({
      id: hit.id,
      messageId: hit.document.messageId,
      channelId: hit.document.channelId,
      threadId: hit.document.threadId,
      serverId: hit.document.serverId,
      sender: hit.document.sender,
      authorId: hit.document.authorId,
      content: hit.document.content,
      timestamp: hit.document.timestamp
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
