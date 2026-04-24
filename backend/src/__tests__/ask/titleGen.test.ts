import { describe, expect, it, vi } from "vitest";
import { generateTitle } from "../../ask/titleGen.js";

function fakeOpenAI(content: string) {
  return {
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content } }],
        }),
      },
    },
  } as never;
}

describe("generateTitle", () => {
  it("returns a trimmed, quote-free title", async () => {
    const title = await generateTitle({
      openai: fakeOpenAI('"How work results accumulate"'),
      model: "anthropic/claude-haiku-4-5",
      question: "How do work results accumulate in JAM?",
    });
    expect(title).toBe("How work results accumulate");
  });

  it("strips trailing punctuation", async () => {
    const title = await generateTitle({
      openai: fakeOpenAI("Safrole PVF execution!"),
      model: "x",
      question: "q",
    });
    expect(title).toBe("Safrole PVF execution");
  });

  it("throws on empty model output", async () => {
    await expect(
      generateTitle({
        openai: fakeOpenAI(""),
        model: "x",
        question: "q",
      })
    ).rejects.toThrow(/empty/i);
  });

  it("truncates to 80 chars max", async () => {
    const title = await generateTitle({
      openai: fakeOpenAI("A".repeat(200)),
      model: "x",
      question: "q",
    });
    expect(title.length).toBeLessThanOrEqual(80);
  });
});
