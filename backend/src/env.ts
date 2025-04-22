import "dotenv/config";

import { z } from "zod";

export const envSchema = z.object({
  HOMESERVER_URL: z.string().url(),
  ACCESS_TOKEN: z.string().min(1).optional(),
  USER_ID: z.string().min(1),
  MATRIX_USERNAME: z.string().min(1),
  MATRIX_PASSWORD: z.string().min(1),
  ROOM_IDS: z
    .string()
    .min(1)
    .transform((val) => val.split(";")),
  POSTGRES_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
};

export const env = parseEnv();
