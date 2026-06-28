---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.test.ts#L248-L345
title: packages/core/pvm-interpreter/memory/memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 3
chunk_total: 5
content_sha: 491a0cb596272df9fbf02deaadb5bd988d8d1f78e3de3e4e2d257303264d150c
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.test.ts` (lines 248–345)

```typescript
      const firstPage = WriteablePage.new(firstPageNumber, new Uint8Array(PAGE_SIZE));
      const secondPage = WriteablePage.new(secondPageNumber, new Uint8Array(PAGE_SIZE));
      const memoryMap = new Map<PageNumber, MemoryPage>();
      const sbrkIndex = tryAsSbrkIndex(0);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      memoryMap.set(firstPageNumber, firstPage);
      memoryMap.set(secondPageNumber, secondPage);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const dataToStore = new Uint8Array([1, 2, 3, 4]);
      const addressToStore = tryAsMemoryIndex(MAX_MEMORY_INDEX - 2);
      const expectedMemoryMap = new Map();
      expectedMemoryMap.set(firstPageNumber, WriteablePage.new(firstPageNumber, new Uint8Array(PAGE_SIZE)));
      expectedMemoryMap.set(secondPageNumber, WriteablePage.new(secondPageNumber, new Uint8Array(PAGE_SIZE)));

      const expectedMemory = {
        sbrkIndex,
        virtualSbrkIndex: sbrkIndex,
        endHeapIndex,
        memory: expectedMemoryMap,
      };

      const storeResult = memory.storeFrom(addressToStore, dataToStore);

      deepEqual(
        storeResult,
        Result.error(PageFault.fromPageNumber(0, true), () => "Page fault: attempted to access reserved page 0"),
      );
      assert.deepEqual(memory, expectedMemory);
    });
  });

  describe("sbrk", () => {
    it("should allocate one page", () => {
      const memory = Memory.new();
      const lengthToAllocate = 5;
      const expectedMemoryMap = new Map();
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);

      expectedMemoryMap.set(pageNumber, WriteablePage.new(pageNumber, new Uint8Array(MIN_ALLOCATION_LENGTH)));

      const expectedMemory = {
        sbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + PAGE_SIZE,
        virtualSbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + lengthToAllocate,
        endHeapIndex: MAX_MEMORY_INDEX,
        memory: expectedMemoryMap,
      };

      memory.sbrk(lengthToAllocate);

      assert.deepEqual(memory, expectedMemory);
    });

    it("should allocate two pages", () => {
      const memory = Memory.new();
      const lengthToAllocate = PAGE_SIZE + 5;
      const expectedMemoryMap = new Map();
      const firstPageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const secondPageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES + 1);

      expectedMemoryMap.set(firstPageNumber, WriteablePage.new(firstPageNumber, new Uint8Array(MIN_ALLOCATION_LENGTH)));
      expectedMemoryMap.set(
        secondPageNumber,
        WriteablePage.new(secondPageNumber, new Uint8Array(MIN_ALLOCATION_LENGTH)),
      );

      const expectedMemory = {
        sbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 2 * PAGE_SIZE,
        virtualSbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + lengthToAllocate,
        endHeapIndex: MAX_MEMORY_INDEX,
        memory: expectedMemoryMap,
      };

      memory.sbrk(lengthToAllocate);

      assert.deepEqual(memory, expectedMemory);
    });

    it("should not allocate if virtualSbrkIndex + length < sbrkIndex", () => {
      const memory = Memory.new();
      const lengthToAllocate = 5;
      const expectedMemoryMap = new Map();
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);

      expectedMemoryMap.set(pageNumber, WriteablePage.new(pageNumber, new Uint8Array(MIN_ALLOCATION_LENGTH)));

      const expectedMemoryAfterFirstAllocation = {
        sbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + PAGE_SIZE,
        virtualSbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + lengthToAllocate,
        endHeapIndex: MAX_MEMORY_INDEX,
        memory: expectedMemoryMap,
      };

      memory.sbrk(lengthToAllocate);

      assert.deepEqual(memory, expectedMemoryAfterFirstAllocation);

      const expectedMemoryAfterSecondAllocation = {
        sbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + PAGE_SIZE,
```
