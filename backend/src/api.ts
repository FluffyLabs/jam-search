import { Hono } from "hono";
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

  // Embeddings
  // TODO [ToDr] this should be rate-limitted and encrypted.
  app.get("/embeddings", async (c) => {
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
