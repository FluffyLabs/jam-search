/**
 * One-time migration script: exports all data from PostgreSQL to markdown files.
 *
 * Usage: npx tsx src/scripts/exportToMarkdown.ts [dataDir]
 *
 * Requires POSTGRES_URL environment variable to be set.
 */
import "dotenv/config";
import { pgTable, serial, text, timestamp, vector } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { CHANNELS } from "../../../shared/discord.js";
import { ROOMS } from "../../../shared/matrix.js";
import {
  type ChatMessage,
  type PageData,
  slugify,
  writeDiscordDayFile,
  writeDocsPage,
  writeEmbeddings,
  writeGithubPage,
  writeGraypaperSection,
  writeGraypaperVersions,
  writeMatrixDayFile,
} from "../data/writer.js";

// --- Inline schema definitions (since db/schema.ts was removed) ---

const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageId: text("messageid").unique(),
  roomId: text("roomid"),
  sender: text("sender"),
  content: text("content"),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
});

const graypapersTable = pgTable("graypapers", {
  version: text("version").primaryKey(),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
});

const graypaperSectionsTable = pgTable("graypaper_sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
});

const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  content: text("content").notNull(),
  title: text("title").notNull(),
  site: text("site"),
  created_at: timestamp("created_at", { mode: "date", precision: 3 }).notNull(),
  lastModified: timestamp("last_modified", {
    mode: "date",
    precision: 3,
  }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
});

const discordsTable = pgTable("discords", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").unique(),
  channelId: text("channel_id"),
  threadId: text("thread_id"),
  serverId: text("server_id"),
  sender: text("sender"),
  authorId: text("author_id"),
  content: text("content"),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
});

// --- Main export logic ---

const dataDir = process.argv[2] || "./data";
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("POSTGRES_URL environment variable is required");
  process.exit(1);
}

// Strip channel_binding from URL since postgres.js doesn't support it natively
const cleanUrl = connectionString.replace(/[&?]channel_binding=[^&]*/g, "");
const client = postgres(cleanUrl, { ssl: "require" });
const db = drizzle(client);

async function exportMatrixMessages() {
  console.log("Exporting Matrix messages...");
  const messages = await db.select().from(messagesTable);
  console.log(`Found ${messages.length} Matrix messages`);

  const groups = new Map<string, ChatMessage[]>();
  const embeddings: Record<string, number[]> = {};

  for (const msg of messages) {
    if (!msg.content || !msg.messageId) continue;

    const date = msg.timestamp.toISOString().split("T")[0];
    const room = ROOMS.find((r) => r.id === msg.roomId);
    const roomName = room?.name || msg.roomId || "unknown";
    const key = `${roomName}|${msg.roomId}|${date}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)?.push({
      sender: msg.sender || "unknown",
      timestamp: msg.timestamp,
      messageId: msg.messageId,
      content: msg.content,
    });

    if (msg.embedding) {
      const filePath = `matrix/${slugify(roomName)}/${date}.md`;
      embeddings[`${filePath}:${msg.messageId}`] = msg.embedding as number[];
    }
  }

  for (const [key, msgs] of groups) {
    const [roomName, roomId, date] = key.split("|");
    writeMatrixDayFile(dataDir, roomName, roomId, date, msgs);
  }

  console.log(`Exported ${groups.size} Matrix day files`);
  return embeddings;
}

async function exportDiscordMessages() {
  console.log("Exporting Discord messages...");
  const messages = await db.select().from(discordsTable);
  console.log(`Found ${messages.length} Discord messages`);

  const groups = new Map<string, { msgs: ChatMessage[]; threadId?: string }>();
  const embeddings: Record<string, number[]> = {};

  for (const msg of messages) {
    if (!msg.content || !msg.messageId) continue;

    const channel = CHANNELS.find((c) => c.channelId === msg.channelId);
    const channelName = channel?.name || msg.channelId || "unknown";
    const date = msg.timestamp.toISOString().split("T")[0];

    let key: string;
    if (msg.threadId) {
      key = `${channelName}|${msg.channelId}|${msg.serverId}|${msg.threadId}|${date}`;
    } else {
      key = `${channelName}|${msg.channelId}|${msg.serverId}||${date}`;
    }

    if (!groups.has(key)) {
      groups.set(key, { msgs: [], threadId: msg.threadId || undefined });
    }
    groups.get(key)?.msgs.push({
      sender: msg.sender || "unknown",
      timestamp: msg.timestamp,
      messageId: msg.messageId,
      content: msg.content,
    });

    if (msg.embedding) {
      const dirName = slugify(channelName);
      let filePath: string;
      if (msg.threadId) {
        filePath = `discord/${dirName}/threads/${msg.threadId}.md`;
      } else {
        filePath = `discord/${dirName}/${date}.md`;
      }
      embeddings[`${filePath}:${msg.messageId}`] = msg.embedding as number[];
    }
  }

  for (const [key, { msgs, threadId }] of groups) {
    const [channelName, channelId, serverId, , date] = key.split("|");
    writeDiscordDayFile(
      dataDir,
      channelName,
      channelId,
      serverId,
      date,
      msgs,
      threadId
    );
  }

  console.log(`Exported ${groups.size} Discord files`);
  return embeddings;
}

async function exportPages() {
  console.log("Exporting pages...");
  const pages = await db.select().from(pagesTable);
  console.log(`Found ${pages.length} pages`);

  const embeddings: Record<string, number[]> = {};

  for (const page of pages) {
    const pageData: PageData = {
      url: page.url,
      title: page.title,
      content: page.content,
      site: page.site || "",
      createdAt: page.created_at,
      lastModified: page.lastModified,
    };

    let filePath: string;

    if (page.site?.startsWith("github.com/")) {
      const match = page.url.match(
        /github\.com\/([^/]+)\/([^/]+)\/(issues|pull|discussions)\/(\d+)/
      );
      if (match) {
        const [, owner, repo, typeStr, number] = match;
        const type =
          typeStr === "pull"
            ? "pr"
            : typeStr === "discussions"
              ? "discussion"
              : "issue";
        filePath = writeGithubPage(
          dataDir,
          owner,
          repo,
          type,
          parseInt(number, 10),
          pageData
        );
      } else {
        filePath = writeDocsPage(dataDir, pageData);
      }
    } else {
      filePath = writeDocsPage(dataDir, pageData);
    }

    if (page.embedding) {
      embeddings[filePath] = page.embedding as number[];
    }
  }

  console.log(`Exported ${pages.length} page files`);
  return embeddings;
}

async function exportGraypaper() {
  console.log("Exporting graypaper...");

  const versions = await db.select().from(graypapersTable);
  writeGraypaperVersions(
    dataDir,
    versions.map((v) => ({ version: v.version, timestamp: v.timestamp }))
  );
  console.log(`Exported ${versions.length} graypaper versions`);

  const sections = await db.select().from(graypaperSectionsTable);
  const embeddings: Record<string, number[]> = {};

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const filePath = writeGraypaperSection(dataDir, {
      title: section.title,
      text: section.text,
      index: i + 1,
    });

    if (section.embedding) {
      embeddings[filePath] = section.embedding as number[];
    }
  }

  console.log(`Exported ${sections.length} graypaper sections`);
  return embeddings;
}

async function main() {
  console.log(`Exporting data to ${dataDir}...`);

  const [matrixEmb, discordEmb, pagesEmb, graypaperEmb] = await Promise.all([
    exportMatrixMessages(),
    exportDiscordMessages(),
    exportPages(),
    exportGraypaper(),
  ]);

  const allEmbeddings = {
    ...matrixEmb,
    ...discordEmb,
    ...pagesEmb,
    ...graypaperEmb,
  };

  writeEmbeddings(dataDir, allEmbeddings);
  console.log(
    `Exported ${Object.keys(allEmbeddings).length} embeddings to embeddings.json`
  );

  console.log("Export complete!");
  await client.end();
}

main().catch(async (error) => {
  console.error("Export failed:", error);
  await client.end();
  process.exit(1);
});
