import OpenAI from "openai";
import z from "zod";
import { env } from "../env.js";

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
