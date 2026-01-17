import { serve } from "@hono/node-server";
import { createApp } from "./api.js";
import { env } from "./env.js";
import { cleanupMcpTransports } from "./mcp/handler.js";

async function main() {
  const app = createApp();

  // Start HTTP server
  const server = serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`🚀 Server running on http://localhost:${env.PORT}`);

  const shutdown = async () => {
    console.log("🛑 Shutting down...");
    cleanupMcpTransports();
    server.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
