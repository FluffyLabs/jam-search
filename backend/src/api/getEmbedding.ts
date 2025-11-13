import OpenAI from "openai";
import z from "zod";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import { env } from "../env.js";

export const getEmbeddingSchema = z.object({
  q: z.string(),
});

// In-memory cache for OpenAI API results (keyed by query string)
const queryCache = new Map<string, number[]>();

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

  const embedding = response.data[0].embedding;
  queryCache.set(data.q, embedding);

  // Store in embedding cache and return the ID
  const cacheId = embeddingCache.store(embedding, data.q);
  return { id: cacheId };
}
