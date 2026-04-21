import { describe, expect, it } from "vitest";
import { chunkCodeFile } from "../../scripts/codeChunker.js";

describe("chunkCodeFile", () => {
  it("returns a single chunk when file is small", () => {
    const text = "line 1\nline 2\nline 3\n";
    const chunks = chunkCodeFile(text, { maxChars: 4000, overlapChars: 200 });
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      startLine: 1,
      endLine: 3,
      text,
      chunkIndex: 0,
      chunkTotal: 1,
    });
  });

  it("splits when adding next line exceeds maxChars, with line-based overlap", () => {
    const line = `${"x".repeat(99)}\n`; // 100 chars incl newline
    const text = line.repeat(50); // 5000 chars total, 50 lines
    const chunks = chunkCodeFile(text, { maxChars: 1000, overlapChars: 200 });

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].startLine).toBe(1);
    expect(chunks[0].endLine).toBeLessThanOrEqual(10);

    // Overlap: next chunk should start at a line <= end of previous chunk
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].startLine).toBeLessThanOrEqual(chunks[i - 1].endLine);
      expect(chunks[i].startLine).toBeGreaterThan(1);
    }

    // Chunk index and total are populated
    for (let i = 0; i < chunks.length; i++) {
      expect(chunks[i].chunkIndex).toBe(i);
      expect(chunks[i].chunkTotal).toBe(chunks.length);
    }
  });

  it("emits an oversized single line as its own chunk untouched", () => {
    const hugeLine = "z".repeat(10_000);
    const text = `short\n${hugeLine}\nshort again\n`;
    const chunks = chunkCodeFile(text, { maxChars: 1000, overlapChars: 200 });

    const hugeChunk = chunks.find((c) => c.text.includes(hugeLine));
    expect(hugeChunk).toBeDefined();
    expect(hugeChunk?.text).toContain(hugeLine);
  });

  it("never returns an empty chunk", () => {
    const chunks = chunkCodeFile("", { maxChars: 1000, overlapChars: 200 });
    expect(chunks).toEqual([]);
  });

  it("preserves line endings so start/end line numbers are 1-based and inclusive", () => {
    const text = "a\nb\nc\nd\ne\n";
    const chunks = chunkCodeFile(text, { maxChars: 4, overlapChars: 0 });
    expect(chunks[0].startLine).toBe(1);
    // With maxChars=4 and no overlap, greedy packing should produce multiple chunks
    expect(chunks.length).toBeGreaterThan(1);
    // Last chunk ends at line 5
    expect(chunks[chunks.length - 1].endLine).toBe(5);
  });
});
