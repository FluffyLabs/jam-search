ALTER TABLE "messages" DROP COLUMN IF EXISTS "searchable";

CREATE INDEX IF NOT EXISTS messages_search_idx ON messages
USING bm25 (id, sender, content)
WITH (key_field='id');