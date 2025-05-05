import { type SQL, and, cosineDistance, desc, like, sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import OpenAI from "openai";
import { z } from "zod";
import { db } from "./db/db.js";
import {
  graypaperSectionsTable,
  graypapersTable,
  messagesTable,
} from "./db/schema.js";

const isDevelopment = process.env.NODE_ENV === "development";
const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function createApp() {
  const app = new Hono();

  // Middleware
  app.use(logger());

  app.use(
    cors({
      origin: isDevelopment ? ["http://localhost:5173"] : "*",
    })
  );

  // Health check endpoint
  app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const searchMessagesRequestSchema = z.object({
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

  // Search endpoint
  app.get("/search/messages", async (c) => {
    const result = searchMessagesRequestSchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters" }, 400);
    }
    const data = result.data;

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
      whereConditions.push(sql`roomid @@@ ${`"${data.channelId}"`}`);
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
          .where(like(graypapersTable.version, data.filter_since_gp))
          .orderBy(desc(graypapersTable.timestamp))
          .limit(1);

        if (gpVersionResult.length > 0) {
          // Use the timestamp from graypaper to filter messages
          const gpTimestamp = gpVersionResult[0].timestamp;

          startDate = gpTimestamp;
        } else {
          // If graypaper version not found, return empty results
          return c.json({
            results: [],
            total: 0,
            page: data.page,
            pageSize: data.pageSize,
            error: `Graypaper version ${data.filter_since_gp} not found`,
          });
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
          sql`id @@@ paradedb.boolean(should => ARRAY[
            ${
              searchTerms.length > 1
                ? sql`paradedb.phrase('content', ARRAY[${sql.join(
                    searchTerms.map((term) => sql`${term}`),
                    sql.raw(", ")
                  )}])`
                : sql`paradedb.match('content', ${data.q}, conjunction_mode => true)`
            },
            paradedb.match('sender', ${data.q}, conjunction_mode => true)
          ])`
        );
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
            paradedb.match('content', ${data.q}),
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
            messagesTable.embedding,
            embedding
          )}) AS similarity`;

          orderBy = sql`similarity DESC, timestamp DESC, id`;
          whereConditions.push(
            sql`${cosineDistance(messagesTable.embedding, embedding)} < 0.8`
          );
        } catch (error) {
          console.error("Error generating embedding for search query:", error);
          // Fallback to standard search if embedding fails
          whereConditions.push(
            sql`id @@@ paradedb.match('content', ${data.q})`
          );
        }
        break;
      default:
        throw new Error(`Unhandled search mode: ${data.searchMode}`);
    }

    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(messagesTable)
      .where(and(...whereConditions));
    const query = db
      .select({
        messageid: messagesTable.messageid,
        sender: messagesTable.sender,
        content: messagesTable.content,
        timestamp: messagesTable.timestamp,
        roomid: messagesTable.roomid,
        similarity,
        score: sql<number>`paradedb.score(id)`,
      })
      .from(messagesTable)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .offset((data.page - 1) * data.pageSize)
      .limit(data.pageSize);
    const results = await query;

    const total = Number(countResult[0].count);
    console.log(`Message search query found ${total} results`);

    return c.json({
      results,
      total,
      page: data.page,
      pageSize: data.pageSize,
    });
  });

  const searchGraypaperRequestSchema = z.object({
    q: z.string(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().lte(100).default(10),
    searchMode: z.enum(["fuzzy", "semantic", "strict"]).default("strict"),
  });

  app.get("/search/graypaper", async (c) => {
    const result = searchGraypaperRequestSchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters" }, 400);
    }
    const data = result.data;

    // Base search condition
    const whereConditions = [];

    let orderBy: SQL = sql`paradedb.score(id) DESC, id DESC`;
    let similarity = sql<number>`1`;

    const searchTerms = data.q.toLowerCase().split(/\s+/);
    switch (data.searchMode) {
      case "strict": {
        whereConditions.push(
          sql`id @@@ paradedb.boolean(should => ARRAY[
            ${
              searchTerms.length > 1
                ? sql`paradedb.phrase('title', ARRAY[${sql.join(
                    searchTerms.map((term) => sql`${term}`),
                    sql.raw(", ")
                  )}])`
                : sql`paradedb.match('title', ${data.q}, conjunction_mode => true)`
            },
            ${
              searchTerms.length > 1
                ? sql`paradedb.phrase('text', ARRAY[${sql.join(
                    searchTerms.map((term) => sql`${term}`),
                    sql.raw(", ")
                  )}])`
                : sql`paradedb.match('text', ${data.q}, conjunction_mode => true)`
            }
          ])`
        );
        break;
      }
      case "fuzzy":
        whereConditions.push(sql`id @@@ paradedb.boolean(should => ARRAY[
          ${
            searchTerms.length > 1
              ? sql`
            paradedb.boost(10, paradedb.phrase('title', ARRAY[${sql.join(
              searchTerms.map((term) => sql`${term}`),
              sql.raw(", ")
            )}])),
            paradedb.boost(10, paradedb.phrase('text', ARRAY[${sql.join(
              searchTerms.map((term) => sql`${term}`),
              sql.raw(", ")
            )}])),`
              : sql``
          }
          paradedb.match('title', ${data.q}),
          paradedb.match('text', ${data.q})
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
            graypaperSectionsTable.embedding,
            embedding
          )}) AS similarity`;

          orderBy = sql`similarity DESC, id DESC`;
          whereConditions.push(
            sql`${cosineDistance(
              graypaperSectionsTable.embedding,
              embedding
            )} < 0.8`
          );
        } catch (error) {
          console.error("Error generating embedding for search query:", error);
          // Fallback to standard search if embedding fails
          whereConditions.push(
            sql`id @@@ paradedb.boolean(should => ARRAY[
              paradedb.match('title', ${data.q}),
              paradedb.match('text', ${data.q})
            ])`
          );
        }
        break;
      default:
        throw new Error(`Unhandled search mode: ${data.searchMode}`);
    }

    // Get total count of matching rows
    const countResult = await db
      // TODO: Similarity filter
      .select({ count: sql`count(*)` })
      .from(graypaperSectionsTable)
      .where(and(...whereConditions));

    const total = Number(countResult[0].count);
    console.log(`Graypaper search query found ${total} results`);

    // Get paginated results
    const results = await db
      .select({
        id: graypaperSectionsTable.id,
        title: graypaperSectionsTable.title,
        text: graypaperSectionsTable.text,
        similarity,
        score: sql<number>`paradedb.score(id)`,
      })
      .from(graypaperSectionsTable)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .offset((data.page - 1) * data.pageSize)
      .limit(data.pageSize);

    return c.json({
      results,
      total,
      page: data.page,
      pageSize: data.pageSize,
    });
  });

  return app;
}
