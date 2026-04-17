import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";
import { runAgentLoop } from "../ask/agentLoop.js";
import { createOpenRouterClient } from "../ask/openrouter.js";
import { chatMessageSchema } from "../ask/types.js";
import type { SearchDB } from "../data/searchIndex.js";

export const askRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  model: z.string().min(1),
  openrouterKey: z.string().min(1),
});

export function handleAsk(db: SearchDB, dataDir: string) {
  return async (c: Context) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const parsed = askRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Invalid request", issues: parsed.error.issues },
        400
      );
    }
    const { messages, model, openrouterKey } = parsed.data;

    const openai = createOpenRouterClient(openrouterKey);

    return streamSSE(c, async (stream) => {
      const gen = runAgentLoop({
        messages,
        model,
        openai,
        db,
        dataDir,
      });
      for await (const event of gen) {
        await stream.writeSSE({
          event: event.type,
          data: JSON.stringify(event),
        });
      }
    });
  };
}
