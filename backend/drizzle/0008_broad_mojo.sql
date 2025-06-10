CREATE TABLE "discords" (
	"id" serial PRIMARY KEY NOT NULL,
	"messageid" text,
	"channelid" text,
	"sender" text,
	"author_id" text,
	"content" text,
	"timestamp" timestamp (3) NOT NULL,
	"embedding" vector(1536),
	CONSTRAINT "discords_messageid_unique" UNIQUE("messageid")
);
--> statement-breakpoint
CREATE INDEX "discords_search_idx" ON "discords" USING bm25 ("id","sender","content","channelid","timestamp") WITH (key_field=id,text_fields='{ "channelid": { "fast": true } }');--> statement-breakpoint
CREATE INDEX "discords_embedding_index" ON "discords" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "discords_channelid_idx" ON "discords" USING btree ("channelid");