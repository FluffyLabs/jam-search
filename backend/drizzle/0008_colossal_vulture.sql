CREATE TABLE "discords" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" text,
	"channel_id" text,
	"sender" text,
	"author_id" text,
	"content" text,
	"timestamp" timestamp (3) NOT NULL,
	"embedding" vector(1536),
	CONSTRAINT "discords_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE INDEX "discords_search_idx" ON "discords" USING bm25 ("id","sender","content","channel_id","timestamp") WITH (key_field=id,text_fields='{ "channel_id": { "fast": true } }');--> statement-breakpoint
CREATE INDEX "discords_embedding_index" ON "discords" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "discords_channel_id_idx" ON "discords" USING btree ("channel_id");