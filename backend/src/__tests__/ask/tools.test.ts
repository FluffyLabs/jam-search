import { describe, expect, it } from "vitest";
import { executeSearchAll } from "../../ask/tools.js";
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
});
