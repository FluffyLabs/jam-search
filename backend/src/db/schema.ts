import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    messageid: text("messageid").unique(),
    roomid: text("roomid"),
    sender: text("sender"),
    content: text("content"),
    timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [
    index("messages_search_idx")
      .using("bm25", table.id, table.sender, table.content)
      .with({
        key_field: "id",
      }),
    index("messages_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
    index("messages_roomid_idx").on(table.roomid),
    index("messages_roomid_timestamp_idx").on(
      table.roomid,
      table.timestamp.desc()
    ),
  ]
);

export type Message = typeof messagesTable.$inferSelect;

export const graypapersTable = pgTable("graypapers", {
  version: text("version").primaryKey(),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
});

export const graypaperSectionsTable = pgTable(
  "graypaper_sections",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    text: text("text").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [
    index("graypaper_search_idx")
      .using("bm25", table.id, table.title, table.text)
      .with({
        key_field: "id",
      }),
    index("graypaper_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export type GraypaperSection = typeof graypaperSectionsTable.$inferSelect;
