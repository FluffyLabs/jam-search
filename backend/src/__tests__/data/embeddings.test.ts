import { describe, expect, it } from "vitest";
import { buildBatches } from "../../data/embeddings.js";
import type { SearchDoc } from "../../data/searchIndex.js";

function makeItem(text: string, id = "x") {
  return {
    doc: { id } as SearchDoc,
    key: id,
    text,
  };
}

describe("buildBatches", () => {
  it("returns no batches for empty input", () => {
    expect(buildBatches([])).toEqual([]);
  });

  it("packs all items into one batch when both caps allow it", () => {
    const items = [makeItem("a"), makeItem("b"), makeItem("c")];
    const batches = buildBatches(items, 10, 1000);
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(3);
  });

  it("splits when item-count cap is exceeded", () => {
    const items = Array.from({ length: 7 }, (_, i) => makeItem("a", `id${i}`));
    const batches = buildBatches(items, 3, 1_000_000);
    expect(batches.map((b) => b.length)).toEqual([3, 3, 1]);
  });

  it("splits when token cap would be exceeded", () => {
    // Each text is 400 chars => ~100 estimated tokens.
    // Token cap = 250 means at most 2 items per batch.
    const items = Array.from({ length: 5 }, (_, i) =>
      makeItem("x".repeat(400), `id${i}`)
    );
    const batches = buildBatches(items, 1000, 250);
    expect(batches.map((b) => b.length)).toEqual([2, 2, 1]);
  });

  it("never produces an empty batch even when a single item exceeds the token cap", () => {
    // One huge item alone would exceed the cap; it must still be sent in its
    // own batch rather than dropped or producing an empty batch.
    const items = [
      makeItem("x".repeat(2000), "huge"),
      makeItem("small", "small"),
    ];
    const batches = buildBatches(items, 1000, 100);
    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(1);
    expect(batches[0][0].key).toBe("huge");
    expect(batches[1]).toHaveLength(1);
    expect(batches[1][0].key).toBe("small");
  });

  it("respects the production batch — a 500-item batch of 20k-char docs splits", () => {
    // This is the exact production scenario that triggered the OpenAI 300k-token
    // error: 500 items each carrying up to 20k chars (~5k estimated tokens) would
    // be ~2.5M tokens in one request. The token cap must split them.
    const items = Array.from({ length: 500 }, (_, i) =>
      makeItem("x".repeat(20_000), `id${i}`)
    );
    const batches = buildBatches(items);
    // Each item is ~5000 tokens; cap is 250k; expect ~50 items per batch.
    expect(batches.length).toBeGreaterThan(1);
    for (const batch of batches) {
      const totalChars = batch.reduce((sum, b) => sum + b.text.length, 0);
      expect(Math.ceil(totalChars / 4)).toBeLessThanOrEqual(250_000);
    }
    // No items lost.
    const total = batches.reduce((sum, b) => sum + b.length, 0);
    expect(total).toBe(500);
  });
});
