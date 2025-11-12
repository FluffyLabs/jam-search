import OpenAI from "openai";
import z from "zod";
import { env } from "../env.js";

export const getEmbeddingSchema = z.object({
  q: z.string(),
});

function encodeFloatVector(vector: number[]): string {
  // Convert to Float32Array for consistent 32-bit precision
  const float32Array = new Float32Array(vector);

  // Get the underlying bytes
  const bytes = new Uint8Array(float32Array.buffer);

  // Convert to base64
  return btoa(String.fromCharCode(...bytes));
}

export function decodeFloatVector(encoded: string): number[] {
  // Decode from base64
  const binaryString = atob(encoded);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert back to Float32Array
  const float32Array = new Float32Array(bytes.buffer);

  // Return as regular number array
  return Array.from(float32Array);
}

const cache = new Map<string, string>();
export async function getEmbedding(data: z.infer<typeof getEmbeddingSchema>) {
  const fromCache = cache.get(data.q);
  if (fromCache !== undefined) {
    return fromCache;
  }
  // TODO [ToDr] introduce cache
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: data.q,
    dimensions: 1536,
  });

  const res = encodeFloatVector(response.data[0].embedding);
  cache.set(data.q, res);
  return res;
}
