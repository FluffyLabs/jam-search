import OpenAI from "openai";
import z from "zod";
import {env} from "../env.js";

export const getEmbeddingSchema = z.object({
  q: z.string(),
});

export async function getEmbedding(
  data: z.infer<typeof getEmbeddingSchema>
) {
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: data.q,
    dimensions: 1536,
  });

  return response.data[0].embedding;
}
