import {
  type SQL,
  and,
  cosineDistance,
  desc,
  eq,
  gt,
  gte,
  like,
  lt,
  sql,
} from "drizzle-orm";
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
      // Use LIKE for prefix matching on sender names
      whereConditions.push(like(messagesTable.sender, `${senderName}%`));
    }

    // Add filter condition for channelId
    if (data.channelId) {
      // TODO: Ranking is not working correctly when filtering like that. Let's use fast fields: https://docs.paradedb.com/documentation/full-text/filtering
      whereConditions.push(eq(messagesTable.roomid, data.channelId));
    }

    // Lookup timestamp for graypaper version if filter_since_gp is provided
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
        // Convert Date object to ISO string for SQL comparison
        whereConditions.push(gte(messagesTable.timestamp, gpTimestamp));
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

    if (data.filter_before) {
      whereConditions.push(
        lt(messagesTable.timestamp, new Date(data.filter_before))
      );
    }

    if (data.filter_after) {
      whereConditions.push(
        gt(messagesTable.timestamp, new Date(data.filter_after))
      );
    }

    let orderBy: SQL = sql`paradedb.score(id) DESC, timestamp DESC, id`;
    let similarity = sql<number>`1`;

    switch (data.searchMode) {
      case "strict": {
        const searchTerms = data.q.toLowerCase().split(/\s+/);
        whereConditions.push(
          sql`id @@@ paradedb.boolean(should => ARRAY[
            paradedb.phrase('content', ARRAY[${sql.join(
              searchTerms.map((term) => sql`${term}`),
              sql.raw(", ")
            )}]),
            paradedb.match('sender', ${data.q}, conjunction_mode => true)
          ])`
        );
        break;
      }
      case "fuzzy": {
        const searchTerms = data.q.toLowerCase().split(/\s+/);
        whereConditions.push(
          sql`id @@@ paradedb.boolean(should => ARRAY[
            paradedb.boost(10, paradedb.phrase('content', ARRAY[${sql.join(
              searchTerms.map((term) => sql`${term}`),
              sql.raw(", ")
            )}])),
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
            sql`${messagesTable.embedding} IS NOT NULL AND ${cosineDistance(
              messagesTable.embedding,
              embedding
            )} < 0.7`
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
          sql`id @@@ paradedb.boolean(must => ARRAY[
            paradedb.phrase('title', ARRAY[${sql.join(
              searchTerms.map((term) => sql`${term}`),
              sql.raw(", ")
            )}]),
            paradedb.phrase('text', ARRAY[${sql.join(
              searchTerms.map((term) => sql`${term}`),
              sql.raw(", ")
            )}]),
          ])`
        );
        break;
      }
      case "fuzzy":
        whereConditions.push(sql`id @@@ paradedb.boolean(should => ARRAY[
          paradedb.boost(10, paradedb.phrase('title', ARRAY[${sql.join(
            searchTerms.map((term) => sql`${term}`),
            sql.raw(", ")
          )}])),
          paradedb.boost(10, paradedb.phrase('text', ARRAY[${sql.join(
            searchTerms.map((term) => sql`${term}`),
            sql.raw(", ")
          )}])),
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
            sql`${
              graypaperSectionsTable.embedding
            } IS NOT NULL AND ${cosineDistance(
              graypaperSectionsTable.embedding,
              embedding
            )} < 0.7`
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

    // Let's check if we have any graypaper sections with embeddings
    if (data.searchMode === "semantic") {
      const embeddingCheckResult = await db
        .select({ count: sql`count(*)` })
        .from(graypaperSectionsTable)
        .where(sql`embedding IS NOT NULL`);

      console.log(
        `Found ${embeddingCheckResult[0].count} graypaper sections with embeddings`
      );
    }

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
