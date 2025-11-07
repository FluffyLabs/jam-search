import { describe, expect, it } from "vitest";
import { findBestMatch } from "./PageResultHighlighter";

describe("findBestMatch", () => {
  describe("strict mode", () => {
    it("finds exact match at beginning", () => {
      const result = findBestMatch(
        "Hello world this is a test",
        "Hello world",
        "strict"
      );
      expect(result).toEqual({ index: 0, length: 11 });
    });

    it("finds exact match in middle", () => {
      const result = findBestMatch(
        "Hello world this is a test",
        "this is",
        "strict"
      );
      expect(result).toEqual({ index: 12, length: 7 });
    });

    it("finds exact match at end", () => {
      const result = findBestMatch(
        "Hello world this is a test",
        "a test",
        "strict"
      );
      expect(result).toEqual({ index: 20, length: 6 });
    });

    it("is case insensitive", () => {
      const result = findBestMatch(
        "Hello World This Is A Test",
        "hello world",
        "strict"
      );
      expect(result).toEqual({ index: 0, length: 11 });
    });

    it("returns null when no exact match found", () => {
      const result = findBestMatch(
        "Hello world this is a test",
        "nonexistent phrase",
        "strict"
      );
      expect(result).toBeNull();
    });

    it("handles empty query", () => {
      const result = findBestMatch("Hello world", "", "strict");
      expect(result).toBeNull();
    });

    it("handles empty content", () => {
      const result = findBestMatch("", "hello", "strict");
      expect(result).toBeNull();
    });
  });

  describe("non-strict mode", () => {
    it("finds full query match", () => {
      const result = findBestMatch(
        "The quick brown fox jumps over",
        "quick brown fox",
        "fuzzy"
      );
      expect(result).toEqual({ index: 4, length: 15 }); // "quick brown fox"
    });

    it("finds longest consecutive subsequence - beginning", () => {
      const result = findBestMatch(
        "apple banana cherry grape orange",
        "apple banana cherry dragon fruit",
        "fuzzy"
      );
      expect(result).toEqual({ index: 0, length: 19 }); // "apple banana cherry"
    });

    it("finds longest consecutive subsequence - middle", () => {
      const result = findBestMatch(
        "hello world test case example smart",
        "random test case example end",
        "fuzzy"
      );
      expect(result).toEqual({ index: 12, length: 17 }); // "test case example"
    });

    it("finds longest consecutive subsequence - end", () => {
      const result = findBestMatch(
        "start middle final step done",
        "begin final step done",
        "fuzzy"
      );
      expect(result).toEqual({ index: 13, length: 15 }); // "final step done"
    });

    it("finds single word match when no consecutive match exists", () => {
      const result = findBestMatch(
        "apple orange banana grape",
        "apple grape banana",
        "fuzzy"
      );
      expect(result).not.toBeNull();
      expect(result?.length).toBeGreaterThan(0);
    });

    it("finds first occurrence of longest match", () => {
      const result = findBestMatch(
        "one two three four five six seven",
        "two three four unused five six seven",
        "fuzzy"
      );
      // Both "two three four" and "five six seven" have length 3, finds first one
      expect(result).toEqual({ index: 4, length: 14 }); // "two three four"
    });

    it("handles single word query", () => {
      const result = findBestMatch("hello world test", "world", "fuzzy");
      expect(result).toEqual({ index: 6, length: 5 });
    });

    it("is case insensitive", () => {
      const result = findBestMatch(
        "Hello World Test Case",
        "HELLO WORLD test",
        "fuzzy"
      );
      expect(result).toEqual({ index: 0, length: 16 }); // "Hello World Test" = 16 chars
    });

    it("handles multiple spaces in query", () => {
      const result = findBestMatch(
        "hello world test case",
        "hello   world   test",
        "fuzzy"
      );
      expect(result).toEqual({ index: 0, length: 16 }); // "hello world test"
    });

    it("returns null when no words match", () => {
      const result = findBestMatch(
        "apple banana cherry",
        "dragon fruit mango",
        "fuzzy"
      );
      expect(result).toBeNull();
    });

    it("returns null for empty query", () => {
      const result = findBestMatch("hello world", "", "fuzzy");
      expect(result).toBeNull();
    });

    it("returns null for query with only spaces", () => {
      const result = findBestMatch("hello world", "   ", "fuzzy");
      expect(result).toBeNull();
    });

    it("handles empty content", () => {
      const result = findBestMatch("", "hello world", "fuzzy");
      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles single character matches", () => {
      const result = findBestMatch("a", "a", "strict");
      expect(result).toEqual({ index: 0, length: 1 });
    });

    it("handles unicode characters", () => {
      const result = findBestMatch(
        "café résumé naïve",
        "café résumé",
        "strict"
      );
      expect(result).toEqual({ index: 0, length: 11 });
    });

    it("handles very long content efficiently", () => {
      const longContent = `${"word ".repeat(1000)}target match here ${"word ".repeat(347)}`;
      const result = findBestMatch(longContent, "target match", "fuzzy");
      expect(result).not.toBeNull();
      expect(result?.length).toBe(12); // "target match"
    });
  });

  describe("complex scenarios", () => {
    it.each([
      {
        name: "gap in middle - finds longest contiguous part",
        content: "w1 w2 w3 w4 w5 w6 w7 w8 w9 w10 w11 w12",
        query: "w1 w2 w3 w4 w5 missing w7 w8 w9 w10 w11 w12",
        expected: { index: 18, length: 20 }, // "w7 w8 w9 w10 w11 w12" (6 words > 5 words)
      },
      {
        name: "finds optimal among scattered matches",
        content: "w1 w2 w3 w4 w5 w6 w7 w8 w9 w10 w11 w12 w13 w14 w15",
        query:
          "w1 w2 missing w4 missing w6 w7 w8 w9 w10 w11 missing w13 missing w15",
        expected: { index: 15, length: 19 }, // "w6 w7 w8 w9 w10 w11" (6 consecutive words)
      },
      {
        name: "prioritizes length over position",
        content: "w1 w3 w5 w7 w9 w11 w12 w13 w14 w15 w16 w17 w18",
        query: "w1 w2 w3 w4 w5 w6 w7 w8 w9 w10 w11 w12 w13 w14 w15 w16 w17 w18",
        expected: { index: 15, length: 31 }, // "w11 w12 w13 w14 w15 w16 w17 w18" (8 words)
      },
      {
        name: "overlapping patterns - finds first occurrence of longest",
        content: "w1 w1 w2 w1 w2 w3 w1 w2 w3 w4 w5",
        query: "w1 w2 w1 w2 w3 w4 w5 unused",
        expected: { index: 3, length: 14 }, // "w1 w2 w1 w2 w3" (first 5-word match)
      },
    ])("$name", ({ content, query, expected }) => {
      const result = findBestMatch(content, query, "fuzzy");
      expect(result).toEqual(expected);
    });
  });
});
