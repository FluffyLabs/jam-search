import "dotenv/config";

import { z } from "zod";

export const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  GITHUB_TOKEN: z.string(),
  DISCORD_TOKEN: z.string(),
  FIRECRAWL_API_KEY: z.string(),
  POSTGRES_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error(`❌ Invalid environment variables: ${error}`);
    process.exit(1);
  }
};

export const env = parseEnv();
