import { db } from "../db/db.js";
import {
  type DiscordConfig,
  fetchDiscordContent,
  storeContentInDatabase,
} from "./fetchDiscordMessages.js";

const config: DiscordConfig = {
  token: process.env.DISCORD_TOKEN || "",
  channels: [
    { serverId: "1354783684867264604", channelId: "1357838246276497590" },
  ],
  includeThreads: false,
};

// Fetch and store Discord messages
fetchDiscordContent(config)
  .then(async (messages) => {
    console.log(`Found ${messages.length} messages`);
    await storeContentInDatabase(messages);
    console.log("Done! Closing connection...");
    await db.$client.end();
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
