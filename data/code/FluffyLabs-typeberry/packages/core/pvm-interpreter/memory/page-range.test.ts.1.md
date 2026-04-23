---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/page-range.test.ts#L106-L225
title: packages/core/pvm-interpreter/memory/page-range.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 004754d44e49f2ca767eafe20aebe1c108713e4dc18773d65f3b19b324656dbc
language: typescript
---
`packages/core/pvm-interpreter/memory/page-range.test.ts` (lines 106–225)

```typescript
      const pageNumbers = Array.from(pageRange);

      assert.deepStrictEqual(pageNumbers, [1, 2]);
    });

    it("should return page numbers for a non-empty wrapped range", () => {
      const start = tryAsPageNumber(MAX_NUMBER_OF_PAGES - 2);
      const length = 4;

      const pageRange = PageRange.fromStartAndLength(start, length);

      const pageNumbers = Array.from(pageRange);

      assert.deepStrictEqual(pageNumbers, [MAX_NUMBER_OF_PAGES - 2, MAX_NUMBER_OF_PAGES - 1, 0, 1]);
    });

    it("should return page numbers for a short memory range that spans last and first pages ", () => {
      const start = tryAsMemoryIndex(MAX_MEMORY_INDEX - 2);
      const length = 4;
      const range = MemoryRange.fromStartAndLength(start, length);

      const pageRange = PageRange.fromMemoryRange(range);
      const pageNumbers = Array.from(pageRange);

      assert.deepStrictEqual(pageNumbers, [MAX_NUMBER_OF_PAGES - 1, 0]);
    });
  });

  describe("isWrapped", () => {
    it("should return true for a wrapped range", () => {
      const start = tryAsPageNumber(3);
      const length = MAX_NUMBER_OF_PAGES - 1;

      const memoryRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isWrapped(), true);
    });

    it("should return false for a non-wrapped range", () => {
      const start = tryAsPageNumber(1);
      const length = 5;

      const memoryRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isWrapped(), false);
    });
  });

  describe("isInRange", () => {
    it("should return true for a page number that is in range (non-wrapped)", () => {
      const start = tryAsPageNumber(1);
      const length = 3;
      const page = tryAsPageNumber(2);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), true);
    });

    it("should return true for a page number that is in range (wrapped)", () => {
      const start = tryAsPageNumber(MAX_NUMBER_OF_PAGES - 2);
      const length = 5;
      const page = tryAsPageNumber(2);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), true);
    });

    it("should return false for a page number that is not in range (non-wrapped)", () => {
      const start = tryAsPageNumber(1);
      const length = 1;
      const page = tryAsPageNumber(3);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), false);
    });

    it("should return false for a page number that is not in range (wrapped)", () => {
      const start = tryAsPageNumber(MAX_NUMBER_OF_PAGES - 2);
      const length = 5;
      const page = tryAsPageNumber(6);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), false);
    });

    it("should return false for an empty range", () => {
      const start = tryAsPageNumber(1);
      const length = 0;
      const page = tryAsPageNumber(1);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), false);
    });

    it("should return true for a page number that is equal to `start`", () => {
      const start = tryAsPageNumber(1);
      const length = 1;
      const page = tryAsPageNumber(1);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), true);
    });

    it("should return false for a page number that is equal to `end`", () => {
      const start = tryAsPageNumber(1);
      const length = 1;
      const page = tryAsPageNumber(2);

      const pageRange = PageRange.fromStartAndLength(start, length);

      assert.strictEqual(pageRange.isInRange(page), false);
    });
  });
});
```
