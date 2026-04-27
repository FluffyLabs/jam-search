import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";
import { handleAsk } from "./api/ask.js";
import { handleAskTitle } from "./api/askTitle.js";
import { getEmbedding, getEmbeddingSchema } from "./api/getEmbedding.js";
import {
  searchDiscords,
  searchDiscordsRequestSchema,
} from "./api/searchDiscords.js";
import {
  searchGraypaper,
  searchGraypaperRequestSchema,
} from "./api/searchGraypapers.js";
import {
  searchMessages,
  searchMessagesRequestSchema,
} from "./api/searchMessages.js";
import { searchPages, searchPagesRequestSchema } from "./api/searchPages.js";
import { embeddingCache } from "./cache/embeddingCache.js";
import { getGraypaperLatest } from "./data/graypaperLatest.js";
import type { SearchDB } from "./data/searchIndex.js";
import { createMcpHandler } from "./mcp/handler.js";

const isDevelopment = process.env.NODE_ENV === "development";

export function createApp(db: SearchDB, dataDir: string) {
  const app = new Hono();

  // Middleware
  app.use(logger());

  // CORS is only relevant for browser-origin callers; /mcp is server-to-server
  // and must not advertise any allowed origin. Skip the middleware for it.
  const corsMiddleware = cors({
    origin: isDevelopment
      ? (origin) =>
          /^https?:\/\/localhost(:\d+)?$/.test(origin) ? origin : null
      : "*",
  });
  app.use(async (c, next) => {
    if (c.req.path === "/mcp") return next();
    return corsMiddleware(c, next);
  });

  // Health check endpoint
  app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Rate limiter for embeddings endpoint
  const embeddingsLimiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 60, // Limit each IP to 60 requests per minute
    standardHeaders: "draft-6", // Include rate limit info in headers
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown", // Use IP address as key
  });

  // Embeddings
  app.get("/embeddings", embeddingsLimiter, async (c) => {
    const data = getEmbeddingSchema.parse(c.req.query());
    return c.json(await getEmbedding(data, embeddingCache));
  });

  // Search endpoints
  app.get("/search/messages", async (c) => {
    const data = searchMessagesRequestSchema.parse(c.req.query());
    return c.json(await searchMessages(data, embeddingCache, db, dataDir));
  });

  app.get("/search/discords", async (c) => {
    const data = searchDiscordsRequestSchema.parse(c.req.query());
    return c.json(await searchDiscords(data, embeddingCache, db, dataDir));
  });

  app.get("/search/pages", async (c) => {
    const data = searchPagesRequestSchema.parse(c.req.query());
    return c.json(await searchPages(data, embeddingCache, db, dataDir));
  });

  app.get("/search/graypaper", async (c) => {
    const data = searchGraypaperRequestSchema.parse(c.req.query());
    return c.json(await searchGraypaper(data, embeddingCache, db, dataDir));
  });

  app.get("/graypaper/latest", (c) => {
    return c.json(getGraypaperLatest(dataDir));
  });

  app.post("/ask", handleAsk(db, dataDir));
  app.post("/ask/title", handleAskTitle());

  // MCP (Model Context Protocol): stateless Streamable HTTP endpoint exposing
  // the same two tools the /ask agent uses (search_all + get_full_document).
  app.all("/mcp", createMcpHandler(db, dataDir));

  return app;
}
