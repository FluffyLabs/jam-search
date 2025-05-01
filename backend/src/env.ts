import "dotenv/config";

import { z } from "zod";

// Define a type for the room with its archive URL
export interface RoomInfo {
  id: string;
  archiveUrl: string;
}

export const envSchema = z.object({
  ROOM_IDS: z
    .string()
    .min(1)
    .transform((val) => {
      // Parse the new format: room_id<archive_url>url;room_id<archive_url>url
      return val.split(";").map((roomEntry) => {
        const match = roomEntry.match(/^(.+)<archive_url>(.+)$/);
        if (!match) {
          throw new Error(
            `Invalid room format: ${roomEntry}. Expected format: room_id<archive_url>url`
          );
        }

        const [, roomId, archiveUrl] = match;
        return { id: roomId, archiveUrl };
      });
    }),
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
