import "dotenv/config";

import { z } from "zod";

export const envSchema = z.object({
  OPENAI_API_KEY: z.string().default(""),
  GITHUB_TOKEN: z.string(),
  DISCORD_TOKEN: z.string(),
  DATA_DIR: z.string().default("./data"),
  CACHE_DIR: z.string().default("./cache"),
  PORT: z.coerce.number().default(3000),
  EMBEDDINGS_ENABLED: z
    .union([z.literal("true"), z.literal("false")])
    .default("true")
    .transform((v) => v === "true"),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error(`Invalid environment variables: ${error}`);
    process.exit(1);
  }
};

export const env = parseEnv();
