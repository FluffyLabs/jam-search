import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { z } from "zod";
import { db } from "./db/db.js";
import { messagesTable } from "./db/schema.js";

const isDevelopment = process.env.NODE_ENV === "development";

export function createApp() {
  const app = new Hono();

  // Middleware
  app.use(logger());

  if (!isDevelopment) {
    app.use(
      cors({
        origin: "*",
      })
    );
  }

  // Health check endpoint
  app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const searchRequestSchema = z.object({
    q: z.string(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().lte(100).default(10),
  });

  // Search endpoint
  app.get("/search", async (c) => {
    const result = searchRequestSchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters" }, 400);
    }
    const data = result.data;

    const messages = await db
      .select()
      .from(messagesTable)
      .where(
        sql`id @@@ paradedb.boolean(should => ARRAY[
          paradedb.match('content', ${data.q}, distance => 1),
          paradedb.match('sender', ${data.q}, distance => 1)
        ])`
      )
      .orderBy(sql`paradedb.score(id) DESC`)
      .offset((data.page - 1) * data.pageSize)
      .limit(data.pageSize);
    return c.json({ messages });
  });

  return app;
}
