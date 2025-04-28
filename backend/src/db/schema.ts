import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageid: text("messageid").unique(),
  roomid: text("roomid"),
  sender: text("sender"),
  link: text("link"),
  content: text("content"),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
});

export const graypapersTable = pgTable("graypapers", {
  version: text("version").primaryKey(),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
});

export const graypaperSectionsTable = pgTable("graypaper_sections", {
  id: serial("id").primaryKey(),
  title: text("title"),
  text: text("text").notNull(),
});
