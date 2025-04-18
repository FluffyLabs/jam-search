import { Hono } from "hono";
import { logger } from "hono/logger";

export function createApp() {
  const app = new Hono();

  // Middleware
  app.use(logger());

  // Health check endpoint
  app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}
