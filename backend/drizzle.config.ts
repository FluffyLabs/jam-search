import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.POSTGRES_URL;

if (!url) {
  throw new Error("POSTGRES_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
    ssl: true,
  },
});
