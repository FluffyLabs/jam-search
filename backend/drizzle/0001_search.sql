ALTER TABLE "messages" DROP COLUMN "searchable";

CREATE INDEX messages_search_idx ON messages
USING bm25 (id, sender, content)
WITH (key_field='id');