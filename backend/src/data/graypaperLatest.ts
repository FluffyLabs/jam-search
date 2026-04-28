import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import type { GraypaperLatest } from "../../../shared/graypaper.js";

const EMPTY: GraypaperLatest = { hash: null, version: null };

let cache: {
  dataDir: string;
  mtimeMs: number | null;
  value: GraypaperLatest;
} | null = null;

function versionsPathOf(dataDir: string): string {
  return path.join(dataDir, "graypaper", "versions.md");
}

function getMtime(versionsPath: string): number | null {
  try {
    return fs.statSync(versionsPath).mtimeMs;
  } catch {
    return null;
  }
}

function readFromDisk(versionsPath: string): GraypaperLatest {
  if (!fs.existsSync(versionsPath)) return EMPTY;

  const raw = fs.readFileSync(versionsPath, "utf-8");
  const { data: frontmatter } = matter(raw);
  return {
    hash: (frontmatter.latest_hash as string) ?? null,
    version: (frontmatter.latest_version as string) ?? null,
  };
}

/**
 * Read the latest graypaper hash + version from versions.md.
 * Cached per dataDir, invalidated when the file's mtime changes — needed
 * because graypaperJob runs out-of-process and rewrites versions.md without
 * the API server's knowledge.
 */
export function getGraypaperLatest(dataDir: string): GraypaperLatest {
  const versionsPath = versionsPathOf(dataDir);
  const mtimeMs = getMtime(versionsPath);
  if (cache && cache.dataDir === dataDir && cache.mtimeMs === mtimeMs) {
    return cache.value;
  }
  const value = readFromDisk(versionsPath);
  cache = { dataDir, mtimeMs, value };
  return value;
}

/** Reset the in-memory cache. Used by tests. */
export function resetGraypaperLatestCache(): void {
  cache = null;
}
