import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import type { GraypaperLatest } from "../../../shared/graypaper.js";

const EMPTY: GraypaperLatest = { hash: null, version: null };

let cache: { dataDir: string; value: GraypaperLatest } | null = null;

function readFromDisk(dataDir: string): GraypaperLatest {
  const versionsPath = path.join(dataDir, "graypaper", "versions.md");
  if (!fs.existsSync(versionsPath)) return EMPTY;

  const raw = fs.readFileSync(versionsPath, "utf-8");
  const { data: frontmatter } = matter(raw);
  return {
    hash: (frontmatter.latest_hash as string) ?? null,
    version: (frontmatter.latest_version as string) ?? null,
  };
}

/** Read the latest graypaper hash + version from versions.md, cached per dataDir. */
export function getGraypaperLatest(dataDir: string): GraypaperLatest {
  if (cache && cache.dataDir === dataDir) return cache.value;
  const value = readFromDisk(dataDir);
  cache = { dataDir, value };
  return value;
}

/** Reset the in-memory cache. Used by tests. */
export function resetGraypaperLatestCache(): void {
  cache = null;
}
