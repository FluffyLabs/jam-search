---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.test.ts#L165-L251
title: packages/core/pvm-interpreter/memory/memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 5
content_sha: f8f67aaf69346f6a75f77774480e1397e9f1fd97921ae0778107a5039eb82dc2
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.test.ts` (lines 165–251)

```typescript
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      memoryMap.set(pageNumber, page);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const dataToStore = new Uint8Array([1, 2, 3, 4]);
      const addressToStore = tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 1);
      const expectedMemoryMap = new Map();
      expectedMemoryMap.set(
        pageNumber,
        WriteablePage.new(
          pageNumber,
          new Uint8Array([0, ...dataToStore, ...new Uint8Array(MIN_ALLOCATION_LENGTH - dataToStore.length - 1)]),
        ),
      );
      const expectedMemory = {
        sbrkIndex,
        virtualSbrkIndex: sbrkIndex,
        endHeapIndex,
        memory: expectedMemoryMap,
      };

      const storeResult = memory.storeFrom(addressToStore, dataToStore);

      assert.deepStrictEqual(storeResult, Result.ok(OK));
      assert.deepEqual(memory, expectedMemory);
    });

    it("should correctly store data on two pages", () => {
      const firstPageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const secondPageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES + 1);
      const firstPage = WriteablePage.new(firstPageNumber, new Uint8Array(PAGE_SIZE));
      const secondPage = WriteablePage.new(secondPageNumber, new Uint8Array());
      const memoryMap = new Map<PageNumber, MemoryPage>();
      const sbrkIndex = tryAsSbrkIndex(20 * PAGE_SIZE);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      memoryMap.set(firstPageNumber, firstPage);
      memoryMap.set(secondPageNumber, secondPage);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const dataToStore = new Uint8Array([1, 2, 3, 4]);
      const addressToStore = tryAsMemoryIndex(17 * PAGE_SIZE - 2);
      const expectedMemoryMap = new Map();
      expectedMemoryMap.set(
        firstPageNumber,
        WriteablePage.new(firstPageNumber, new Uint8Array([...new Uint8Array(PAGE_SIZE - 2), 1, 2])),
      );
      expectedMemoryMap.set(
        secondPageNumber,
        WriteablePage.new(secondPageNumber, new Uint8Array([3, 4, ...new Uint8Array(MIN_ALLOCATION_LENGTH - 2)])),
      );

      const expectedMemory = {
        sbrkIndex,
        virtualSbrkIndex: sbrkIndex,
        endHeapIndex,
        memory: expectedMemoryMap,
      };
      const storeResult = memory.storeFrom(addressToStore, dataToStore);

      assert.deepStrictEqual(storeResult, Result.ok(OK));
      assert.deepEqual(memory, expectedMemory);
    });

    it("should return PageFault if case of storing data on 2 pages but one of them does not exist", () => {
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const bytes = new Uint8Array();
      const page = WriteablePage.new(pageNumber, bytes);
      const memoryMap = new Map<PageNumber, MemoryPage>();
      memoryMap.set(pageNumber, page);
      const sbrkIndex = tryAsSbrkIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const addressToStore = tryAsMemoryIndex(17 * PAGE_SIZE - 2);

      const storeResult = memory.storeFrom(addressToStore, new Uint8Array(4));

      deepEqual(
        storeResult,
        Result.error(PageFault.fromPageNumber(17), () => "Page fault: page 17 not allocated"),
      );
    });

    it("should return fault when store data on two pages - the last page and the first page", () => {
      const firstPageNumber = tryAsPageNumber((MAX_MEMORY_INDEX - PAGE_SIZE + 1) / PAGE_SIZE);
      const secondPageNumber = tryAsPageNumber(0);
      const firstPage = WriteablePage.new(firstPageNumber, new Uint8Array(PAGE_SIZE));
      const secondPage = WriteablePage.new(secondPageNumber, new Uint8Array(PAGE_SIZE));
      const memoryMap = new Map<PageNumber, MemoryPage>();
      const sbrkIndex = tryAsSbrkIndex(0);
```
