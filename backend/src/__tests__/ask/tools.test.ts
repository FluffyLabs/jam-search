import { describe, expect, it } from "vitest";
import { executeGetFullDocument, executeSearchAll } from "../../ask/tools.js";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";

describe("executeSearchAll", () => {
  it("returns flattened results across all sources", async () => {
    const db = createSearchDB();
    insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "The accumulate function processes work results.",
    });
    insertDoc(db, {
      type: "discord",
      sender: "alice",
      channelId: "c1",
      channelName: "implementers",
      content: "Discussion about accumulate.",
      messageId: "m1",
      timestamp: Date.now(),
    });

    const results = await executeSearchAll(
      { query: "accumulate", limit: 5 },
      db,
      "./data"
    );

    const sourceTypes = new Set(results.map((r) => r.sourceType));
    expect(sourceTypes.has("graypaper")).toBe(true);
    expect(sourceTypes.has("discord")).toBe(true);
    // Every result has a stable id and a preview field.
    for (const r of results) {
      expect(typeof r.id).toBe("string");
      expect(r.id.length).toBeGreaterThan(0);
      expect(typeof r.preview).toBe("string");
    }
  });

  it("does not throw when OPENAI_API_KEY is unset and returns an array", async () => {
    const saved = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      const db = createSearchDB();
      const results = await executeSearchAll({ query: "anything" }, db, "./data");
      expect(Array.isArray(results)).toBe(true);
    } finally {
      if (saved !== undefined) {
        process.env.OPENAI_API_KEY = saved;
      }
    }
  });
});

describe("executeGetFullDocument", () => {
  it("returns the full document markdown by id", async () => {
    const db = createSearchDB();
    const id = insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "Full body of the accumulate section...",
    });

    const result = await executeGetFullDocument({ id }, db);

    expect(result).not.toBeNull();
    expect(result?.sourceType).toBe("graypaper");
    expect(result?.content).toContain("Full body of the accumulate section");
  });

  it("returns null for an unknown id", async () => {
    const db = createSearchDB();
    const result = await executeGetFullDocument({ id: "does-not-exist" }, db);
    expect(result).toBeNull();
  });
});
