CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"content" text NOT NULL,
	"title" text NOT NULL,
	"site" text NOT NULL,
	"last_modified" timestamp (3) NOT NULL,
	"embedding" vector(1536),
	CONSTRAINT "pages_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE INDEX "pages_search_idx" ON "pages" USING bm25 ("id", "url", "content", "title") WITH (key_field = id);
--> statement-breakpoint
CREATE INDEX "pages_embedding_index" ON "pages" USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX "pages_site_idx" ON "pages" USING btree ("site");