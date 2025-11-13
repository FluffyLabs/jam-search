import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
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

  // Rate limiter for embeddings endpoint
  const embeddingsLimiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 20, // Limit each IP to 20 requests per minute
    standardHeaders: "draft-6", // Include rate limit info in headers
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown", // Use IP address as key
  });

  // Embeddings
  app.get("/embeddings", embeddingsLimiter, async (c) => {
    const data = getEmbeddingSchema.parse(c.req.query());
    return c.json(await getEmbedding(data));
  });

  // Search endpoints
  app.get("/search/messages", async (c) => {
    const data = searchMessagesRequestSchema.parse(c.req.query());
    return c.json(await searchMessages(data));
  });

  app.get("/search/discords", async (c) => {
    const data = searchDiscordsRequestSchema.parse(c.req.query());
    return c.json(await searchDiscords(data));
  });

  app.get("/search/pages", async (c) => {
    const data = searchPagesRequestSchema.parse(c.req.query());
    return c.json(await searchPages(data));
  });

  app.get("/search/graypaper", async (c) => {
    const data = searchGraypaperRequestSchema.parse(c.req.query());
    return c.json(await searchGraypaper(data));
  });

  return app;
}
