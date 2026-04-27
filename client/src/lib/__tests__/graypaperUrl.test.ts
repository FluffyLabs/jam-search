import { buildGraypaperUrl } from "@shared/graypaper";
import { describe, expect, it } from "vitest";

describe("buildGraypaperUrl", () => {
  it("includes a 7-char short hash and version when latest is known", () => {
    const url = buildGraypaperUrl("Accumulate", "work results", {
      hash: "ab2cdbd5b070ba2176e8dd830b06401ce05a954d",
      version: "0.7.2",
    });
    expect(url).toBe(
      "https://graypaper.fluffylabs.dev/#/ab2cdbd?v=0.7.2&search=work results&section=Accumulate"
    );
  });

  it("falls back to the un-pinned URL when hash is missing", () => {
    const url = buildGraypaperUrl("Accumulate", "work", {
      hash: null,
      version: "0.7.2",
    });
    expect(url).toBe(
      "https://graypaper.fluffylabs.dev/#/?search=work&section=Accumulate"
    );
  });

  it("falls back when version is missing", () => {
    const url = buildGraypaperUrl("Accumulate", "work", {
      hash: "ab2cdbd5b070ba2176e8dd830b06401ce05a954d",
      version: null,
    });
    expect(url).toBe(
      "https://graypaper.fluffylabs.dev/#/?search=work&section=Accumulate"
    );
  });

  it("does not URL-encode title or query (matches reader's hash router)", () => {
    const url = buildGraypaperUrl("Section With Space", "two words", {
      hash: "ab2cdbd5b070ba2176e8dd830b06401ce05a954d",
      version: "0.7.2",
    });
    expect(url).toContain("section=Section With Space");
    expect(url).toContain("search=two words");
  });
});
