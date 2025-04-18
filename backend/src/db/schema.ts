import {
  pgTable,
  serial,
  text,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";

export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return `tsvector`;
  },
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageid: text("messageid").unique(),
  roomid: text("roomid"),
  sender: text("sender"),
  link: text("link"),
  content: text("content"),
  timestamp: timestamp("timestamp", { mode: "date", precision: 3 }).notNull(),
  searchable: tsvector("searchable"),
});
