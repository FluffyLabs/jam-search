import * as fs from "node:fs";
import * as path from "node:path";
import { slugify } from "../data/writer.js";

const DATE_FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})\.md$/;

/**
 * Returns the most recent YYYY-MM-DD of an existing matrix day-file for the
 * given room, or null if none exists. ISO dates sort correctly as strings,
 * so a lexicographic max works.
 */
export function findLatestIndexedDate(
  dataDir: string,
  roomName: string
): string | null {
  const dir = path.join(dataDir, "matrix", slugify(roomName));
  if (!fs.existsSync(dir)) {
    return null;
  }

  let latest: string | null = null;
  for (const entry of fs.readdirSync(dir)) {
    const match = DATE_FILENAME_RE.exec(entry);
    if (!match) continue;

    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      continue;
    }

    const date = entry.slice(0, -3);
    if (latest === null || date > latest) {
      latest = date;
    }
  }
  return latest;
}
