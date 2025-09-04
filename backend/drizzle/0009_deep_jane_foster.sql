DROP INDEX "discords_search_idx";--> statement-breakpoint
ALTER TABLE "discords" ADD COLUMN "thread_id" text;--> statement-breakpoint
CREATE INDEX "discords_thread_id_idx" ON "discords" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "discords_channel_thread_idx" ON "discords" USING btree ("channel_id","thread_id");--> statement-breakpoint
CREATE INDEX "discords_search_idx" ON "discords" USING bm25 ("id","sender","content","channel_id","thread_id","timestamp") WITH (key_field=id,text_fields='{ "channel_id": { "fast": true }, "thread_id": { "fast": true } }');