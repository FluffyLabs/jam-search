import OpenAI from "openai";
import z from "zod";
import { env } from "../env.js";
import type { EmbeddingCache } from "../cache/embeddingCache.js";

export const getEmbeddingSchema = z.object({
  q: z.string(),
});

function encodeFloatVector(vector: number[]): string {
  // Convert to Float32Array for consistent 32-bit precision
  const float32Array = new Float32Array(vector);
  const buffer = Buffer.from(
    float32Array.buffer,
    float32Array.byteOffset,
    float32Array.byteLength
  );
  return buffer.toString("base64");
}

export function decodeFloatVector(encoded: string): number[] {
  if (!encoded) return [];
  const buffer = Buffer.from(encoded, "base64");
  const float32Array = new Float32Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength / Float32Array.BYTES_PER_ELEMENT
  );
  return Array.from(float32Array);
}

// In-memory cache for OpenAI API results (keyed by query string)
const queryCache = new Map<string, string>();

export async function getEmbedding(
  data: z.infer<typeof getEmbeddingSchema>,
  embeddingCache: EmbeddingCache
) {
  // Check if we already fetched this query
  const fromCache = queryCache.get(data.q);
  if (fromCache !== undefined) {
    // Return the cache entry ID for this embedding
    const cacheId = embeddingCache.store(fromCache, data.q);
    return { id: cacheId };
  }

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: data.q,
    dimensions: 1536,
  });

  const embedding = encodeFloatVector(response.data[0].embedding);
  queryCache.set(data.q, embedding);

  // Store in embedding cache and return the ID
  const cacheId = embeddingCache.store(embedding, data.q);
  return { id: cacheId };
}
