import { db } from "../db/db.js";
import {
  type DiscordConfig,
  fetchDiscordContent,
  storeContentInDatabase,
} from "./fetchDiscordMessages.js";

// Example usage:
const config: DiscordConfig = {
  token: process.env.DISCORD_TOKEN || "",
  channels: [
    // Add your Discord channel IDs here
    "1357838246276497590", // Example channel ID
  ],
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
