---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-range.test.ts#L113-L211
title: packages/core/pvm-interpreter/memory/memory-range.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: e129c12592d53d10c4b1a9ef6422ccfacd0f6af4177dff73a39ea1589078f499
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-range.test.ts` (lines 113–211)

```typescript
      const start = tryAsMemoryIndex(3 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const address = tryAsMemoryIndex(2 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), false);
    });

    it("should return false for an empty range", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = 0;
      const address = tryAsMemoryIndex(1 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), false);
    });

    it("should return true for a point that is equal to `start`", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const address = tryAsMemoryIndex(1 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), true);
    });

    it("should return false for a point that is equal to `end`", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const address = tryAsMemoryIndex(2 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), false);
    });

    it("should return true for a point that is equal to `end - 1`", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const address = tryAsMemoryIndex(2 * PAGE_SIZE - 1);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), true);
    });
  });

  describe("overlapsWith", () => {
    it("should return true for overlapping ranges", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 2);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(2), 2);

      assert.strictEqual(range1.overlapsWith(range2), true);
      assert.strictEqual(range2.overlapsWith(range1), true);
    });

    it("should return true for equal but not empty ranges", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 1);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 1);

      assert.strictEqual(range1.overlapsWith(range2), true);
      assert.strictEqual(range2.overlapsWith(range1), true);
    });

    it("should return true for equal but not empty ranges (wrapped)", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(3), MEMORY_SIZE - 1);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(3), MEMORY_SIZE - 1);

      assert.strictEqual(range1.overlapsWith(range2), true);
      assert.strictEqual(range2.overlapsWith(range1), true);
    });

    it("should return false for non-overlapping ranges", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 1);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(3), 1);

      assert.strictEqual(range1.overlapsWith(range2), false);
      assert.strictEqual(range2.overlapsWith(range1), false);
    });

    it("should return false for empty range", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(2), 0);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 3);

      assert.strictEqual(range1.overlapsWith(range2), false);
      assert.strictEqual(range2.overlapsWith(range1), false);
    });

    it("should return false when `end` of the first range is equal to `start` of the second range", () => {
      const range1 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(1), 1);
      const range2 = MemoryRange.fromStartAndLength(tryAsMemoryIndex(2), 3);

      assert.strictEqual(range1.overlapsWith(range2), false);
      assert.strictEqual(range2.overlapsWith(range1), false);
    });

```
