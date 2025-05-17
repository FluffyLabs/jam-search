import { db } from "../db/db.js";
import { processBatchEmbeddings } from "./generateEmbeddingsBatch.js";
// Main execution
(async () => {
  try {
    await processBatchEmbeddings();
    await db.$client.end();
  } catch (error) {
    console.error("Error generating embeddings:", error);
    process.exit(1);
  }
})();
