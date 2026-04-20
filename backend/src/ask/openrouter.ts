import OpenAI from "openai";

/**
 * OpenRouter exposes an OpenAI-compatible chat-completions API. We reuse the
 * official openai SDK by pointing its baseURL at OpenRouter.
 */
export function createOpenRouterClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://search.fluffylabs.dev",
      "X-Title": "JAM Search - Ask AI",
    },
  });
}
