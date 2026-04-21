import { serve } from "@hono/node-server";
import { createApp } from "./api.js";
import { loadAllData } from "./data/loader.js";
import { createSearchDB } from "./data/searchIndex.js";
import { env } from "./env.js";

function printEmbeddingsDisabledWarning() {
  const lines = [
    "",
    "╔══════════════════════════════════════════════════════════════╗",
    "║  ⚠  EMBEDDINGS DISABLED (development mode)                   ║",
    "║                                                              ║",
    "║  Semantic search will fall back to fulltext-only results.    ║",
    "║  To enable embeddings locally, run with:                     ║",
    "║    EMBEDDINGS_ENABLED=true npm run dev                       ║",
    "╚══════════════════════════════════════════════════════════════╝",
    "",
  ];
  console.warn(lines.join("\n"));
}

async function main() {
  const {
    DATA_DIR: dataDir,
    CACHE_DIR: cacheDir,
    OPENAI_API_KEY: openaiApiKey,
    EMBEDDINGS_ENABLED: embeddingsEnabled,
  } = env;

  if (!embeddingsEnabled) {
    printEmbeddingsDisabledWarning();
  }

  // Create and populate the in-memory search index
  console.log("Initializing search index...");
  const db = createSearchDB();
  await loadAllData(db, dataDir, cacheDir, openaiApiKey, embeddingsEnabled);

  const app = createApp(db, dataDir);

  // Start HTTP server
  const server = serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`Server running on http://localhost:${env.PORT}`);

  let isShuttingDown = false;
  const shutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log("Shutting down...");
    await new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => (err ? reject(err) : resolve()));
    });
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
