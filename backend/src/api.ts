import { desc, eq, gt, gte, like, lt, sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { db } from "./db/db.js";
import { graypapersTable, messagesTable } from "./db/schema.js";

const isDevelopment = process.env.NODE_ENV === "development";
import { PDFParserService } from "./services/pdf-parser.js";

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

  const searchRequestSchema = z.object({
    q: z.string(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().lte(100).default(10),
    filter_from: z.string().optional(),
    filter_since_gp: z.string().optional(),
    filter_before: z.string().optional(),
    filter_after: z.string().optional(),
  });

  // Search endpoint
  app.get("/search", async (c) => {
    const result = searchRequestSchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters" }, 400);
    }
    const data = result.data;

    // Base search condition
    const searchCondition = sql`id @@@ paradedb.boolean(should => ARRAY[
      paradedb.match('content', ${data.q}, distance => 1),
      paradedb.match('sender', ${data.q}, distance => 1, prefix => true)
    ])`;

    // Initialize additional filter conditions
    const filterConditions = [];

    // Add filter conditions based on parameters
    if (data.filter_from) {
      // Ensure username starts with @ and use prefix matching (LIKE)
      let senderName = data.filter_from;
      if (!senderName.startsWith("@")) {
        senderName = `@${senderName}`;
      }
      // Use LIKE for prefix matching on sender names
      filterConditions.push(sql`sender LIKE ${senderName}%`);
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
        filterConditions.push(gte(messagesTable.timestamp, gpTimestamp));
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
      filterConditions.push(
        lt(messagesTable.timestamp, new Date(data.filter_before))
      );
    }

    if (data.filter_after) {
      filterConditions.push(
        gt(messagesTable.timestamp, new Date(data.filter_after))
      );
    }

    // Combine search condition with filter conditions
    let whereCondition = searchCondition;
    if (filterConditions.length > 0) {
      for (const condition of filterConditions) {
        whereCondition = sql`${whereCondition} AND ${condition}`;
      }
    }

    // Get total count of matching rows
    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(messagesTable)
      .where(whereCondition);

    const total = Number(countResult[0].count);

    // Get paginated results
    const results = await db
      .select()
      .from(messagesTable)
      .where(whereCondition)
      .orderBy(sql`paradedb.score(id) DESC`)
      .offset((data.page - 1) * data.pageSize)
      .limit(data.pageSize);

    return c.json({
      results,
      total,
      page: data.page,
      pageSize: data.pageSize,
    });
  });

  app.get("/parse-pdf", async (c) => {
    const result = await PDFParserService.getInstance().parsePDF(
      "https://graypaper.com/graypaper.pdf"
    );
    return c.json({ result });
  });

  return app;
}
