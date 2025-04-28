import { serve } from "@hono/node-server";
import { type Job, scheduleJob } from "node-schedule";
import { createApp } from "./api.js";
import { db } from "./db/db.js";
import { env } from "./env.js";
import { updateGraypapers } from "./scripts/updateGraypapers.js";
import { MessagesLogger } from "./services/logger.js";
import { MatrixService } from "./services/matrix.js";

const isDev = process.env.NODE_ENV === "development";
async function main() {
  const msgLog = new MessagesLogger({ roomIds: env.ROOM_IDS, db: db });
  const matrixService = isDev
    ? null
    : new MatrixService(
        env.HOMESERVER_URL,
        env.ACCESS_TOKEN,
        env.USER_ID,
        msgLog
      );

  let job: Job | null = null;
  const app = createApp();

  if (!isDev) {
    // Start Matrix client
    await matrixService?.start();

    job = scheduleJob("0 0 * * *", async () => {
      console.log(
        "Running scheduled graypaper update job at",
        new Date().toISOString()
      );
      try {
        await updateGraypapers();
        console.log("Graypaper update job completed successfully");
      } catch (error) {
        console.error("Error in graypaper update job:", error);
      }
    });
  }

  // Start HTTP server
  const server = serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`🚀 Server running on http://localhost:${env.PORT}`);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("🛑 Shutting down...");
    await matrixService?.stop();
    server.close();
    job?.cancel();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
