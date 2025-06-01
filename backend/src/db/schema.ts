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
      .using(
        "bm25",
        table.id,
        table.sender,
        table.content,
        table.roomid,
        table.timestamp
      )
      .with({
        key_field: "id",
        text_fields: '\'{ "roomid": { "fast": true } }\'',
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

export const pagesTable = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull().unique(),
    content: text("content").notNull(),
    title: text("title").notNull(),
    site: text("site"),
    created_at: timestamp("created_at", {
      mode: "date",
      precision: 3,
    }).notNull(),
    lastModified: timestamp("last_modified", {
      mode: "date",
      precision: 3,
    }).notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [
    index("pages_search_idx")
      .using("bm25", table.id, table.url, table.content, table.title)
      .with({
        key_field: "id",
      }),
    index("pages_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
    index("pages_site_idx").on(table.site),
  ]
);

export type Page = typeof pagesTable.$inferSelect;

export const discordsTable = pgTable(
  "discords",
  {
    id: serial("id").primaryKey(),
    messageid: text("messageid").unique(),
    channelid: text("channelid"),
    roomid: text("roomid"),
    sender: text("sender"),
    author_id: text("author_id"),
    content: text("content"),
    timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [
    index("discords_search_idx")
      .using(
        "bm25",
        table.id,
        table.sender,
        table.content,
        table.roomid,
        table.channelid,
        table.timestamp
      )
      .with({
        key_field: "id",
        text_fields:
          '\'{ "roomid": { "fast": true }, "channelid": { "fast": true } }\'',
      }),
    index("discords_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
    index("discords_roomid_idx").on(table.roomid),
    index("discords_channelid_idx").on(table.channelid),
    index("discords_roomid_timestamp_idx").on(
      table.roomid,
      table.timestamp.desc()
    ),
  ]
);

export type Discord = typeof discordsTable.$inferSelect;
