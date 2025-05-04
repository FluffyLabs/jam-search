DROP INDEX IF EXISTS "graypaper_search_idx";
DROP INDEX IF EXISTS "messages_search_idx";

CREATE INDEX "graypaper_search_idx" ON "graypaper_sections" USING bm25 ("id","title","text") WITH (key_field=id);--> statement-breakpoint
CREATE INDEX "messages_search_idx" ON "messages" USING bm25 ("id","sender","content") WITH (key_field=id);--> statement-breakpoint
CREATE INDEX "messages_roomid_idx" ON "messages" USING btree ("roomid");--> statement-breakpoint
CREATE INDEX "messages_roomid_timestamp_idx" ON "messages" USING btree ("roomid","timestamp" DESC NULLS LAST);