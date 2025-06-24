import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import dotenv from "dotenv";
import { and, isNotNull, isNull, sql } from "drizzle-orm";
import OpenAI from "openai";
import { db } from "../db/db.js";
import {
  type Discord,
  type GraypaperSection,
  type Message,
  type Page,
  discordsTable,
  graypaperSectionsTable,
  messagesTable,
  pagesTable,
} from "../db/schema.js";

// Load environment variables
dotenv.config();

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set");
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Process messages and graypaper sections into a batch data string
async function createBatchData(
  messages: Pick<Message, "id" | "content">[],
  graypaperSections: Pick<GraypaperSection, "id" | "title" | "text">[],
  pages: Pick<Page, "id" | "title" | "content">[],
  discords: Pick<Discord, "id" | "content" | "sender" | "channelId">[]
): Promise<string> {
  let batchData = "";

  console.log("Creating batch data...");

  // Add messages to the batch data
  for (const message of messages) {
    if (!message.content) continue;

    const payload = {
      custom_id: `message_${message.id}`,
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: message.content,
        model: "text-embedding-3-small",
        dimensions: 1536,
      },
    };

    batchData += `${JSON.stringify(payload)}\n`;
  }

  // Add graypaper sections to the batch data
  for (const section of graypaperSections) {
    const content = `${section.title}\n${section.text}`;

    const payload = {
      custom_id: `graypaper_${section.id}`,
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: content,
        model: "text-embedding-3-small",
        dimensions: 1536,
      },
    };

    batchData += `${JSON.stringify(payload)}\n`;
  }

  // Add pages to the batch data
  for (const page of pages) {
    // Limit the content to 20000 characters
    const content = `${page.title}\n${page.content.slice(0, 20000)}`;

    const payload = {
      custom_id: `page_${page.id}`,
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: content,
        model: "text-embedding-3-small",
        dimensions: 1536,
      },
    };

    batchData += `${JSON.stringify(payload)}\n`;
  }

  // Add discord messages to the batch data
  for (const discord of discords) {
    if (!discord.content) continue;

    // Include sender and channel info with the content for better context
    const content = `${discord.sender ? `${discord.sender}: ` : ""}${
      discord.content
    }${discord.channelId ? ` #${discord.channelId}` : ""}`;

    const payload = {
      custom_id: `discord_${discord.id}`,
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: content,
        model: "text-embedding-3-small",
        dimensions: 1536,
      },
    };

    batchData += `${JSON.stringify(payload)}\n`;
  }

  return batchData;
}

// Fetch messages and graypaper sections without embeddings
async function fetchItemsWithoutEmbeddings(): Promise<{
  messages: Pick<Message, "id" | "content">[];
  graypaperSections: Pick<GraypaperSection, "id" | "title" | "text">[];
  pages: Pick<Page, "id" | "title" | "content">[];
  discords: Pick<Discord, "id" | "content" | "sender" | "channelId">[];
  totalItems: number;
}> {
  // Fetch messages without embeddings
  console.log("Fetching messages without embeddings...");
  const messages = await db
    .select({
      id: messagesTable.id,
      content: messagesTable.content,
    })
    .from(messagesTable)
    .where(
      and(isNull(messagesTable.embedding), isNotNull(messagesTable.content))
    )
    .execute();

  console.log(`Found ${messages.length} messages without embeddings`);

  // Fetch graypaper sections without embeddings
  console.log("Fetching graypaper sections without embeddings...");
  const graypaperSections = await db
    .select({
      id: graypaperSectionsTable.id,
      title: graypaperSectionsTable.title,
      text: graypaperSectionsTable.text,
    })
    .from(graypaperSectionsTable)
    .where(isNull(graypaperSectionsTable.embedding))
    .execute();

  console.log(
    `Found ${graypaperSections.length} graypaper sections without embeddings`
  );

  // Fetch pages without embeddings
  console.log("Fetching pages without embeddings...");
  const pages = await db
    .select({
      id: pagesTable.id,
      title: pagesTable.title,
      content: pagesTable.content,
    })
    .from(pagesTable)
    .where(isNull(pagesTable.embedding))
    .execute();

  console.log(`Found ${pages.length} pages without embeddings`);

  // Fetch discord messages without embeddings
  console.log("Fetching discord messages without embeddings...");
  const discords = await db
    .select({
      id: discordsTable.id,
      content: discordsTable.content,
      sender: discordsTable.sender,
      channelId: discordsTable.channelId,
    })
    .from(discordsTable)
    .where(
      and(isNull(discordsTable.embedding), isNotNull(discordsTable.content))
    )
    .execute();

  console.log(`Found ${discords.length} discord messages without embeddings`);

  const totalItems =
    messages.length + graypaperSections.length + pages.length + discords.length;

  return { messages, graypaperSections, pages, discords, totalItems };
}

// Create a temporary file that will be deleted after use
async function createTempFile(data: string): Promise<string> {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(
    tempDir,
    `embedding_batch_${Date.now()}.jsonl`
  );
  fs.writeFileSync(tempFilePath, data, { encoding: "utf8" });
  return tempFilePath;
}

// Process the batch embeddings
export async function processBatchEmbeddings() {
  // Check for in-progress batches
  console.log("Checking for in-progress batch jobs...");

  let batchToMonitor = null;
  let batchId = "";

  try {
    const batches = await openai.batches.list();
    // Look for any active batch jobs for embeddings
    for (const batch of batches.data) {
      if (
        batch.endpoint === "/v1/embeddings" &&
        batch.status !== "completed" &&
        batch.status !== "failed" &&
        batch.id
      ) {
        batchToMonitor = batch;
        break;
      }
    }
  } catch (error) {
    console.error("Error listing batches:", error);
    return;
  }

  if (batchToMonitor) {
    // Use the existing batch job
    console.log(
      `Found existing batch job with ID: ${batchToMonitor.id}. Will monitor its progress.`
    );
    batchId = batchToMonitor.id;
  } else {
    // Create a new batch job
    // Fetch items without embeddings
    const { messages, graypaperSections, pages, discords, totalItems } =
      await fetchItemsWithoutEmbeddings();

    if (totalItems === 0) {
      console.log("No items to process. Exiting.");
      return;
    }

    // Create batch data in memory
    const batchData = await createBatchData(
      messages,
      graypaperSections,
      pages,
      discords
    );
    console.log(`Created batch data with ${totalItems} items`);

    // Create a temporary file (will be auto-deleted)
    const tempFilePath = await createTempFile(batchData);

    try {
      // Upload data to OpenAI
      console.log("Uploading batch data to OpenAI...");
      const file = await openai.files.create({
        file: fs.createReadStream(tempFilePath),
        purpose: "batch",
      });

      console.log(`File uploaded with ID: ${file.id}`);

      // Create batch job
      console.log("Creating batch job...");
      const batch = await openai.batches.create({
        input_file_id: file.id,
        endpoint: "/v1/embeddings",
        completion_window: "24h", // Only option currently available
      });

      console.log(`Batch job created with ID: ${batch.id}`);
      console.log(`Initial status: ${batch.status}`);
      batchId = batch.id;
    } finally {
      // Clean up temporary file as it's no longer needed
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log("Temporary file deleted");
      }
    }
  }

  // Poll for job completion
  console.log("Polling for job completion...");
  let completed = false;
  let outputFileId: string | null = null;

  while (!completed) {
    const status = await openai.batches.retrieve(batchId);
    const completedCount = status.request_counts?.completed ?? 0;
    const totalCount = status.request_counts?.total ?? 0;
    console.log(
      `[${new Date().toISOString().split(".")[0]}] Status: ${
        status.status
      }, Completed: ${completedCount}/${totalCount}`
    );

    if (status.status === "completed") {
      completed = true;
      outputFileId = status.output_file_id ?? null;
    } else if (status.status === "failed") {
      throw new Error(`Batch job failed: ${JSON.stringify(status.errors)}`);
    } else {
      // Wait for 10 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  if (!outputFileId) {
    throw new Error("No output file ID found after job completion");
  }

  // Download the results directly to memory
  console.log(`Downloading results from file ID: ${outputFileId}`);
  const response = await openai.files.content(outputFileId);
  const outputContent = await response.text();

  // Parse the results and update the database
  console.log("Parsing results and updating database...");

  // Process each line of the results file
  const lines = outputContent.split("\n").filter((line: string) => line.trim());
  const totalLines = lines.length;
  console.log(`Processing ${totalLines} results...`);
  let updatedCount = 0;

  await db.transaction(async (tx) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const data = JSON.parse(line);
      const customId = data.custom_id;

      // Skip if missing response or embedding
      if (!data.response?.body?.data?.[0]?.embedding) {
        console.warn(`Missing embedding for ${customId}`);
        continue;
      }

      const embedding = data.response.body.data[0].embedding;

      if (customId.startsWith("message_")) {
        const messageId = Number.parseInt(customId.split("_")[1], 10);
        await tx
          .update(messagesTable)
          .set({ embedding })
          .where(sql`${messagesTable.id} = ${messageId}`)
          .execute();
      } else if (customId.startsWith("graypaper_")) {
        const sectionId = Number.parseInt(customId.split("_")[1], 10);
        await tx
          .update(graypaperSectionsTable)
          .set({ embedding })
          .where(sql`${graypaperSectionsTable.id} = ${sectionId}`)
          .execute();
      } else if (customId.startsWith("page_")) {
        const pageId = Number.parseInt(customId.split("_")[1], 10);
        await tx
          .update(pagesTable)
          .set({ embedding })
          .where(sql`${pagesTable.id} = ${pageId}`)
          .execute();
      } else if (customId.startsWith("discord_")) {
        const discordId = Number.parseInt(customId.split("_")[1], 10);
        await tx
          .update(discordsTable)
          .set({ embedding })
          .where(sql`${discordsTable.id} = ${discordId}`)
          .execute();
      }
      updatedCount += 1;
      if (i % 10 === 0) {
        console.log(`Updated ${i}/${totalLines} embeddings...`);
      }
    }
  });

  console.log(
    `Batch embedding process completed! Updated ${updatedCount} embeddings.`
  );
}
