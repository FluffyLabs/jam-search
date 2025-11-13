import { type AnyColumn, cosineDistance, desc, ilike, sql } from "drizzle-orm";
import z from "zod";
import { db } from "../db/db.js";
import { graypapersTable } from "../db/schema.js";
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

  // If not found in cache, ignore it (as per requirements)
  return [];
}

export function simpleParadeMatch(
  field: string,
  query: string,
  options: {
    boost?: number;
    distance?: number;
  } = {}
) {
  const boost = options.boost ?? 1.0;
  const distance = options.distance ?? 2;
  return sql<boolean>`paradedb.boost(${boost}, paradedb.match(
    ${field}, ${query},
    distance => ${distance},
    conjunction_mode => true,
    transposition_cost_one => true
  ))`;
}

export function paradeMatch(fields: [string, number][], query: string) {
  const distance = query.length > 4 ? 2 : 0;

  return sql<boolean>`id @@@ paradedb.boolean(should => ARRAY[
    ${sql.join(
      fields.map(([field, boost]) =>
        simpleParadeMatch(field, query, { boost: 10 * boost, distance: 0 })
      ),
      sql`, `
    )},
    ${sql.join(
      fields.map(([field, boost]) =>
        simpleParadeMatch(field, query, { boost: 2 * boost, distance })
      ),
      sql`, `
    )}
  ])`;
}

const SIMILARITY_THRESHOLD = 0.3;

export function similarityWhere(field: AnyColumn, embedding: number[]) {
  return embedding.length > 0
    ? sql<boolean>`1 - (${cosineDistance(field, embedding)}) > ${SIMILARITY_THRESHOLD}`
    : undefined;
}

export function similarityMatch(field: AnyColumn, embedding: number[]) {
  return embedding.length > 0
    ? sql<number>`1 - (${cosineDistance(field, embedding)}) AS similarity`
    : sql`0 AS similarity`;
}

export async function timeConditions(
  timestampField: string,
  filter_since_gp: string | undefined,
  filter_before: string | undefined,
  filter_after: string | undefined
) {
  let startDate = new Date("1970-01-01");
  let endDate = new Date();

  if (filter_before && !Number.isNaN(new Date(filter_before).getTime())) {
    endDate = new Date(filter_before);
  }

  if (filter_after && !Number.isNaN(new Date(filter_after).getTime())) {
    startDate = new Date(filter_after);
  }

  if (filter_since_gp) {
    // Look up the timestamp for the specified graypaper version
    const gpVersionResult = await db
      .select({ timestamp: graypapersTable.timestamp })
      .from(graypapersTable)
      .where(ilike(graypapersTable.version, filter_since_gp))
      .orderBy(desc(graypapersTable.timestamp))
      .limit(1);

    if (gpVersionResult.length > 0) {
      // Use the timestamp from graypaper to filter messages
      const gpTimestamp = gpVersionResult[0].timestamp;
      startDate = gpTimestamp;
    } else {
      // If graypaper version not found, return empty results
      return {
        ok: false,
        where: [],
        error: `Graypaper version ${filter_since_gp} not found`,
      };
    }
  }

  return {
    ok: true,
    where: [
      sql.raw(
        `${timestampField} @@@ '[${startDate.toISOString()} TO ${endDate.toISOString()}]'`
      ),
    ],
  };
}
