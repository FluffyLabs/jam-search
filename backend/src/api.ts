import {
  type SQL,
  and,
  cosineDistance,
  desc,
  ilike,
  or,
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
  pagesTable,
} from "./db/schema.js";
import {
  searchMessages,
  searchMessagesRequestSchema,
} from "./api/searchMessages.js";
import { searchPages, searchPagesRequestSchema } from "./api/searchPages.js";
import {
  searchGraypapers,
  searchGraypapersRequestSchema,
} from "./api/searchGraypapers.js";

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

  // Search endpoints
  app.get("/search/messages", async (c) => {
    const data = searchMessagesRequestSchema.parse(c.req.query());
    return c.json(await searchMessages(data));
  });

  app.get("/search/pages", async (c) => {
    const data = searchPagesRequestSchema.parse(c.req.query());
    return c.json(await searchPages(data));
  });

  app.get("/search/graypapers", async (c) => {
    const data = searchGraypapersRequestSchema.parse(c.req.query());
    return c.json(await searchGraypapers(data));
  });

  return app;
}
