import * as fs from "node:fs";
import * as path from "node:path";
import z from "zod";
import matter from "gray-matter";
import type { EmbeddingCache } from "../cache/embeddingCache.js";

// Accept embedding as a cache ID string
export const embeddingSchema = z.string().default("");

/**
 * Resolve an embedding from cache ID
 * Cache IDs are 16 hex characters
 */
export function resolveEmbedding(
  embeddingParam: string,
  cache: EmbeddingCache
): number[] {
  if (!embeddingParam) {
    return [];
  }

  const cached = cache.retrieve(embeddingParam);
  if (cached) {
    return cached;
  }

  return [];
}

/**
 * Look up a graypaper version timestamp from the versions.md file
 */
export function lookupGraypaperVersion(
  dataDir: string,
  version: string
): Date | undefined {
  const versionsPath = path.join(dataDir, "graypaper", "versions.md");
  if (!fs.existsSync(versionsPath)) {
    return undefined;
  }

  const raw = fs.readFileSync(versionsPath, "utf-8");
  const { data: frontmatter } = matter(raw);
  const versions = frontmatter.versions as
    | Array<{ version: string; timestamp: string }>
    | undefined;

  if (!versions) return undefined;

  const found = versions.find(
    (v) => v.version.toLowerCase() === version.toLowerCase()
  );
  return found ? new Date(found.timestamp) : undefined;
}

/**
 * Build time range filter for Orama where clause.
 * Returns a `timestamp` filter object or undefined.
 */
export async function timeConditions(
  dataDir: string,
  filter_since_gp: string | undefined,
  filter_before: string | undefined,
  filter_after: string | undefined
): Promise<
  | { ok: true; where: Record<string, unknown> }
  | { ok: false; error: string }
> {
  let startDate = new Date("1970-01-01");
  let endDate = new Date();

  if (filter_before && !Number.isNaN(new Date(filter_before).getTime())) {
    endDate = new Date(filter_before);
  }

  if (filter_after && !Number.isNaN(new Date(filter_after).getTime())) {
    startDate = new Date(filter_after);
  }

  if (filter_since_gp) {
    const gpTimestamp = lookupGraypaperVersion(dataDir, filter_since_gp);
    if (gpTimestamp) {
      startDate = gpTimestamp;
    } else {
      return {
        ok: false,
        error: `Graypaper version ${filter_since_gp} not found`,
      };
    }
  }

  return {
    ok: true,
    where: {
      timestamp: {
        between: [startDate.getTime(), endDate.getTime()],
      },
    },
  };
}
