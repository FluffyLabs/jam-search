import { create, insert, insertMultiple, search, count } from "@orama/orama";
import type { Orama, Results, Result } from "@orama/orama";

export const SCHEMA = {
  // Document type for filtering
  type: "enum",
  // Full-text searchable fields
  content: "string",
  title: "string",
  sender: "string",
  // Vector field for semantic search
  embedding: "vector[1536]",
  // Filterable metadata (not full-text searchable)
  roomId: "enum",
  channelId: "enum",
  threadId: "enum",
  serverId: "enum",
  authorId: "enum",
  messageId: "enum",
  url: "enum",
  site: "enum",
  filePath: "enum",
  roomName: "enum",
  channelName: "enum",
  // Numeric for range queries
  timestamp: "number",
} as const;

export type SearchDB = Orama<typeof SCHEMA>;

export type DocType =
  | "matrix"
  | "discord"
  | "page"
  | "graypaper_section"
  | "graypaper_version";

export interface SearchDoc {
  id?: string;
  type: DocType;
  content: string;
  title?: string;
  sender?: string;
  embedding?: number[];
  roomId?: string;
  channelId?: string;
  threadId?: string;
  serverId?: string;
  authorId?: string;
  messageId?: string;
  url?: string;
  site?: string;
  filePath?: string;
  roomName?: string;
  channelName?: string;
  timestamp?: number;
}

export type SearchResult = Result<SearchDoc>;
export type SearchResults = Results<SearchDoc>;

export function createSearchDB(): SearchDB {
  return create({ schema: SCHEMA });
}

export function insertDoc(db: SearchDB, doc: SearchDoc): string {
  return insert(db, doc) as string;
}

export function insertDocs(db: SearchDB, docs: SearchDoc[]): string[] {
  return insertMultiple(db, docs, 500) as string[];
}

export function countDocs(db: SearchDB): number {
  return count(db) as number;
}

type SchemaKey = keyof typeof SCHEMA;

export interface SearchOptions {
  term: string;
  embedding?: number[];
  type: DocType;
  limit: number;
  offset: number;
  where?: Record<string, unknown>;
  properties?: SchemaKey[];
  boost?: Record<string, number>;
}

export function searchDocs(db: SearchDB, opts: SearchOptions): SearchResults {
  const where: Record<string, unknown> = {
    type: { eq: opts.type },
    ...opts.where,
  };

  const hasVector = opts.embedding && opts.embedding.length > 0;

  if (hasVector) {
    return search(db, {
      mode: "hybrid",
      term: opts.term,
      vector: {
        value: opts.embedding!,
        property: "embedding",
      },
      where,
      properties: opts.properties,
      boost: opts.boost,
      limit: opts.limit,
      offset: opts.offset,
      similarity: 0.3,
      hybridWeights: { text: 0.5, vector: 0.5 },
    }) as SearchResults;
  }

  return search(db, {
    mode: "fulltext",
    term: opts.term,
    where,
    properties: opts.properties,
    boost: opts.boost,
    limit: opts.limit,
    offset: opts.offset,
    tolerance: opts.term.length > 4 ? 2 : 0,
  }) as SearchResults;
}
