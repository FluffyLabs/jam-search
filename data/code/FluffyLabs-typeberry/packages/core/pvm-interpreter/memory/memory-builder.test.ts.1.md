---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-builder.test.ts#L100-L205
title: packages/core/pvm-interpreter/memory/memory-builder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: ccf3c9d80fe004a6e7a0f396fcb6f5d3c79b87f21f788f584c1a5781a998e730
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-builder.test.ts` (lines 100–205)

```typescript
        endHeapIndex: (RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE,
        sbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        virtualSbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        memory: pageMap,
      };

      const memory = builder
        .setReadablePages(
          tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
          new Uint8Array(),
        )
        .finalize(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE),
        );

      assert.deepEqual(memory, expectedMemory);
    });

    it("should add writeable page", () => {
      const builder = new MemoryBuilder();
      const pageMap = new Map();
      pageMap.set(
        RESERVED_NUMBER_OF_PAGES + 2,
        WriteablePage.new(tryAsPageNumber(RESERVED_NUMBER_OF_PAGES + 2), new Uint8Array()),
      );
      const expectedMemory = {
        endHeapIndex: (RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE,
        sbrkIndex: (RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE,
        virtualSbrkIndex: (RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE,
        memory: pageMap,
      };

      const memory = builder
        .setWriteablePages(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE),
          new Uint8Array(),
        )
        .finalize(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE),
          tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE),
        );

      assert.deepEqual(memory, expectedMemory);
    });

    it("should add two pages", () => {
      const builder = new MemoryBuilder();
      const pageMap = new Map();
      pageMap.set(
        RESERVED_NUMBER_OF_PAGES,
        ReadablePage.new(tryAsPageNumber(RESERVED_NUMBER_OF_PAGES), new Uint8Array()),
      );
      pageMap.set(
        RESERVED_NUMBER_OF_PAGES + 1,
        WriteablePage.new(tryAsPageNumber(RESERVED_NUMBER_OF_PAGES + 1), new Uint8Array()),
      );
      const expectedMemory = {
        endHeapIndex: (RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE,
        sbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        virtualSbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        memory: pageMap,
      };

      const memory = builder
        .setReadablePages(
          tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
          new Uint8Array(),
        )
        .setWriteablePages(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          new Uint8Array(),
        )
        .finalize(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE),
        );

      assert.deepEqual(memory, expectedMemory);
    });
  });

  describe("setData", () => {
    it("should add writeable page and set data separately", () => {
      const builder = new MemoryBuilder();
      const pageMap = new Map();
      const data = new Uint8Array(PAGE_SIZE).fill(1);
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const address = tryAsMemoryIndex(pageNumber * PAGE_SIZE);
      pageMap.set(pageNumber, WriteablePage.new(pageNumber, data));
      const expectedMemory = {
        endHeapIndex: (RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE,
        sbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        virtualSbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        memory: pageMap,
      };

      const memory = builder
        .setWriteablePages(
          tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
        )
```
