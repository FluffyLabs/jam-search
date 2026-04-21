import { describe, expect, it } from "vitest";
import { createCiteParser } from "../../ask/citations.js";

describe("createCiteParser", () => {
  it("passes plain text through unchanged", () => {
    const p = createCiteParser();
    const out = p.feed("Hello world");
    expect(out.text).toBe("Hello world");
    expect(out.citations).toEqual([]);
  });

  it("extracts a complete cite tag in one chunk", () => {
    const p = createCiteParser();
    const out = p.feed(
      'The answer <cite n="1" doc="abc" sourceType="graypaper" />[1].'
    );
    expect(out.text).toBe("The answer [1].");
    expect(out.citations).toEqual([
      { n: 1, docId: "abc", sourceType: "graypaper" },
    ]);
  });

  it("handles a cite tag split across two chunks", () => {
    const p = createCiteParser();
    const first = p.feed('The answer <cite n="1" doc="a');
    expect(first.text).toBe("The answer ");
    expect(first.citations).toEqual([]);
    const second = p.feed('bc" sourceType="graypaper" />[1].');
    expect(second.text).toBe("[1].");
    expect(second.citations).toEqual([
      { n: 1, docId: "abc", sourceType: "graypaper" },
    ]);
  });

  it("handles the sourceType attribute missing (graceful fallback)", () => {
    const p = createCiteParser();
    const out = p.feed('<cite n="2" doc="x" />[2]');
    expect(out.text).toBe("[2]");
    // If sourceType is absent, we still emit a citation but with undefined sourceType.
    // Upstream will use the doc id to look it up elsewhere.
    expect(out.citations.length).toBe(1);
    expect(out.citations[0].n).toBe(2);
    expect(out.citations[0].docId).toBe("x");
  });

  it("flushes any trailing buffered text via flush()", () => {
    const p = createCiteParser();
    // Partial tag that never completes.
    p.feed("text <cite n=");
    const out = p.flush();
    expect(out.text).toBe("<cite n=");
  });

  it("passes through stray '<' as text without buffering past it", () => {
    const p = createCiteParser();
    const first = p.feed("P(X < ");
    expect(first.text).toBe("P(X < ");
    expect(first.citations).toEqual([]);
    const second = p.feed("Y) > 0");
    expect(second.text).toBe("Y) > 0");
    expect(second.citations).toEqual([]);
  });

  it("passes through non-cite HTML-like tags without buffering unnecessarily", () => {
    const p = createCiteParser();
    const out = p.feed("<div>hello</div>");
    expect(out.text).toBe("<div>hello</div>");
    expect(out.citations).toEqual([]);
  });
});
