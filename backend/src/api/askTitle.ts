import type { Context } from "hono";
import { z } from "zod";
import { createOpenRouterClient } from "../ask/openrouter.js";
import { generateTitle } from "../ask/titleGen.js";

const titleRequestSchema = z.object({
  question: z.string().trim().min(1).max(8000),
  openrouterKey: z.string().trim().min(1).max(512),
});

export function handleAskTitle() {
  return async (c: Context) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const parsed = titleRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Invalid request", issues: parsed.error.issues },
        400,
      );
    }
    const { question, openrouterKey } = parsed.data;
    const model = process.env.TITLE_MODEL ?? "anthropic/claude-haiku-4-5";
    const openai = createOpenRouterClient(openrouterKey);
    try {
      const title = await generateTitle({ openai, model, question });
      return c.json({ title });
    } catch (err) {
      return c.json(
        { error: (err as Error).message || "Title generation failed" },
        502,
      );
    }
  };
}
