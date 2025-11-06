import { format, subDays } from "date-fns";
import { env } from "../env.js";
import {
  type DiscordConfig,
  fetchDiscordContent,
  storeContentInDatabase,
} from "../scripts/fetchDiscordMessages.js";

const DISCORD_TOKEN = env.DISCORD_TOKEN;

const DISCORD_CHANNELS = [
  /** JAM DAO / #implementers */
  {
    serverId: "1354783684867264604",
    channelId: "1357838246276497590",
  },
];

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in Discord job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running Discord fetch job at", new Date().toISOString());
  // Get Discord configuration from environment variables
  const discordToken = DISCORD_TOKEN;

  if (!discordToken) {
    console.log("Discord token not configured, skipping Discord job");
    return;
  }

  if (DISCORD_CHANNELS.length === 0) {
    console.log("No Discord channels configured, skipping Discord job");
    return;
  }

  // Fetch messages from the last 2 days to ensure we don't miss anything
  const today = new Date();
  const twoDaysAgo = subDays(today, 2);
  const startDate = format(twoDaysAgo, "yyyy-MM-dd");

  const config: DiscordConfig = {
    token: discordToken,
    channels: DISCORD_CHANNELS,
    startDate: startDate,
    maxMessages: 1000,
    includeThreads: true,
  };

  console.log(
    `Fetching Discord messages from ${DISCORD_CHANNELS.length} channels since ${startDate}`
  );
  const messages = await fetchDiscordContent(config);

  if (messages.length > 0) {
    console.log(`Storing ${messages.length} Discord messages in database`);
    await storeContentInDatabase(messages);

    console.log("Discord fetch job completed successfully");
  } else {
    console.log("No new Discord messages found");
  }
}
