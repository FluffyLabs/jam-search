import {AnyColumn, cosineDistance, desc, ilike, sql} from "drizzle-orm";
import {graypapersTable} from "../db/schema.js";
import {db} from "../db/db.js";

export function paradeMatch(field: string, query: string, boost: number = 1.0) {
  return sql`paradedb.boost(${boost}, paradedb.match(
    ${field}, ${query},
    distance => 2,
    conjunction_mode => true,
    transposition_cost_one => true
  ))`;
}

export const SIMILARITY_THRESHOLD = 0.2;

export function similarityMatch(field: AnyColumn, embedding: number[]) {
  return embedding.length > 0 ? sql<number>`1 - (${cosineDistance(
    field,
    embedding
  )}) AS similarity` : sql`0 AS similarity`;
}

export async function timeConditions(
  timestampField: string,
  filter_since_gp: string | undefined,
  filter_before: string | undefined,
  filter_after: string | undefined
) {
  let startDate = new Date("1970-01-01");
  let endDate = new Date();

  if (filter_before && !Number.isNaN(new Date(filter_before))) {
    endDate = new Date(filter_before);
  }

  if (filter_after && !Number.isNaN(new Date(filter_after))) {
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
      )
    ]
  };
}
