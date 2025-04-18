import { serve } from "@hono/node-server";
import { createApp } from "./api.js";
import { db } from "./db/db.js";
import { env } from "./env.js";
import { MessagesLogger } from "./services/logger.js";
import { MatrixService } from "./services/matrix.js";

async function main() {
  const msgLog = new MessagesLogger({ roomIds: env.ROOM_IDS, db: db });
  const matrixService = new MatrixService(
    env.HOMESERVER_URL,
    env.ACCESS_TOKEN,
    env.USER_ID,
    msgLog
  );

  const app = createApp();

  // Start Matrix client
  await matrixService.start();

  // Start HTTP server
  const server = serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`🚀 Server running on http://localhost:${env.PORT}`);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("🛑 Shutting down...");
    await matrixService.stop();
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
