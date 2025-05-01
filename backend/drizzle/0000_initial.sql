CREATE EXTENSION IF NOT EXISTS pg_search;
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"messageid" text,
	"roomid" text,
	"sender" text,
	"content" text,
	"timestamp" timestamp (3) NOT NULL,
	"searchable" "tsvector",
	CONSTRAINT "messages_messageid_unique" UNIQUE("messageid")
);