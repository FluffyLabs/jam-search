import { serve } from "@hono/node-server";
import { createApp } from "./api.js";
import { env } from "./env.js";
import { setupCronJobs } from "./jobs/index.js";

const isDev = process.env.NODE_ENV === "development";

async function main() {
  const app = createApp();
  const jobs = !isDev ? setupCronJobs() : null;

  // Start HTTP server
  const server = serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`🚀 Server running on http://localhost:${env.PORT}`);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("🛑 Shutting down...");
    server.close();
    if (jobs) {
      jobs.matrixJob?.cancel();
      jobs.graypaperJob?.cancel();
      jobs.githubPagesJob?.cancel();
      jobs.docsPagesJob?.cancel();
    }
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
