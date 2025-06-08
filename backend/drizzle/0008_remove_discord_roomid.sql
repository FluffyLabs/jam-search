-- Drop indexes that reference roomid
DROP INDEX IF EXISTS "discords_roomid_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "discords_roomid_timestamp_idx";
--> statement-breakpoint
-- Drop and recreate the search index without roomid
DROP INDEX IF EXISTS "discords_search_idx";
--> statement-breakpoint
CREATE INDEX "discords_search_idx" ON "discords" USING bm25 (
    "id",
    "sender",
    "content",
    "channelid",
    "timestamp"
) WITH (
    key_field = id,
    text_fields = '{ "channelid": { "fast": true } }'
);
--> statement-breakpoint
-- Drop the roomid column
ALTER TABLE "discords" DROP COLUMN IF EXISTS "roomid";
--> statement-breakpoint