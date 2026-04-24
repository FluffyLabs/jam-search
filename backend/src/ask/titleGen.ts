import type OpenAI from "openai";

const TITLE_SYSTEM_PROMPT =
  "You generate short, descriptive titles for a user's first question in a " +
  "chat. Respond with ONLY the title — 5 to 8 words, no surrounding quotes, " +
  "no trailing punctuation, no prefix like 'Title:'. Plain text only.";

export async function generateTitle(args: {
  openai: OpenAI;
  model: string;
  question: string;
}): Promise<string> {
  const { openai, model, question } = args;
  const res = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: TITLE_SYSTEM_PROMPT },
      { role: "user", content: question },
    ],
    max_tokens: 40,
    temperature: 0.2,
  });
  const raw = res.choices[0]?.message?.content?.trim() ?? "";
  if (!raw) throw new Error("Title generation returned empty output");
  const stripped = raw
    .replace(/^["'`]|["'`]$/g, "")
    .replace(/[.!?]+$/g, "")
    .trim();
  if (!stripped) throw new Error("Title generation returned empty output");
  return stripped.slice(0, 80);
}
