import { processBatchEmbeddings } from "../scripts/generateEmbeddingsBatch.js";

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in embeddings job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running embeddings job at", new Date().toISOString());
  try {
    await processBatchEmbeddings();
    console.log("Embeddings job completed successfully");
  } catch (error) {
    console.error("Error in embeddings job:", error);
    throw error;
  }
}
