---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-range.test.ts#L206-L246
title: packages/core/pvm-interpreter/memory/memory-range.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: e78e31df6ee3a28017d7080e14284e1cb9444b9384c29ab4ee100e43ccc96d3c
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-range.test.ts` (lines 206–246)

```typescript
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(2), 3);

      assert.strictEqual(range1.overlapsWith(range2), false);
      assert.strictEqual(range2.overlapsWith(range1), false);
    });

    it("should return false for non-overlapping ranges (wrapped)", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(2), 2);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(4), MEMORY_SIZE - 2);

      assert.strictEqual(range1.overlapsWith(range2), false);
      assert.strictEqual(range2.overlapsWith(range1), false);
    });

    it("should return true when one range completely contains another", () => {
      const outerRange = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 4);
      const innerRange = MemoryRange.fromStartAndLength(tryAsMemoryIndex(2), 2);

      assert.strictEqual(outerRange.overlapsWith(innerRange), true);
      assert.strictEqual(innerRange.overlapsWith(outerRange), true);
    });

    it("should return true for complex overlapping wrapped ranges", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(3), MEMORY_SIZE - 2);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(4), MEMORY_SIZE - 2);

      assert.strictEqual(range1.overlapsWith(range2), true);
      assert.strictEqual(range2.overlapsWith(range1), true);
    });

    it("should return true for non empty and full ranges", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), PAGE_SIZE);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(0), MEMORY_SIZE);

      assert.strictEqual(range1.overlapsWith(range2), true);
      assert.strictEqual(range2.overlapsWith(range1), true);
    });
  });

  describe("getPageNumbers", () => {});
});
```
