import { sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { graypaperSectionsTable, messagesTable } from "../db/schema.js";
import fs from "node:fs";

// try {
//   let context = "";

//   const messages = await db
//     .select()
//     .from(messagesTable)
//     .orderBy(sql`timestamp, id`);
//   context += "Element messages list:\n\n";
//   context += messages
//     .map(
//       (message) =>
//         `id:\n${
//           message.id
//         }\ntimestamp:\n${message.timestamp.toISOString()}\nsender:\n${
//           message.sender
//         }\ncontent:\n${message.content}`
//     )
//     .join("\n\n");

//   const graypaperSections = await db.select().from(graypaperSectionsTable);
//   context += "Graypaper document:\n\n";
//   context += graypaperSections
//     .map((section) => `${section.title}\n${section.text}`)
//     .join("\n\n");

//   fs.writeFileSync("tmp/context.txt", context);

//   await db.$client.end();
// } catch (error) {
//   console.error("Error updating Graypaper sections from PDF:", error);
//   process.exit(1);
// }

import OpenAI from "openai";
const client = new OpenAI();

const vectorStore = await client.vectorStores.create({
  // Create vector store
  name: "JAM context",
});

await client.vectorStores.files.uploadAndPoll(
  vectorStore.id,
  fs.createReadStream("src/context.txt")
);
