CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "graypaper_sections" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX "graypaper_embedding_index" ON "graypaper_sections" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "messages_embedding_index" ON "messages" USING hnsw ("embedding" vector_cosine_ops);