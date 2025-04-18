import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../env.js";
import * as schema from "./schema.js";

export const db = drizzle({
  connection: {
    url: env.POSTGRES_URL,
    ssl: true,
  },
  schema,
});

export type DbClient = typeof db;
