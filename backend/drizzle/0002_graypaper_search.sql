CREATE TABLE IF NOT EXISTS "graypaper_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "graypapers" (
	"version" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp (3) NOT NULL
);

CREATE INDEX IF NOT EXISTS graypaper_search_idx ON graypaper_sections
USING bm25 (id, title, text)
WITH (key_field='id');