---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.test.ts#L79-L168
title: packages/core/pvm-interpreter/memory/memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 5
content_sha: d3d401bb8b841c28c20cf4cbf423bd543ac78fc0cf55f5fa6fe825425b4ee9e6
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.test.ts` (lines 79–168)

```typescript
      const memoryMap = new Map<PageNumber, MemoryPage>();
      memoryMap.set(pageNumber, page);
      const sbrkIndex = tryAsSbrkIndex(0);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const lengthToLoad = 4;
      const result = new Uint8Array(lengthToLoad);
      const addressToLoad = tryAsMemoryIndex(17 * PAGE_SIZE - 2);

      const loadResult = memory.loadInto(result, addressToLoad);

      deepEqual(
        loadResult,
        Result.error(PageFault.fromPageNumber(17), () => "Page fault: page 17 not allocated"),
      );
    });

    it("should return fault when load data from the last page and the first page", () => {
      const firstPageNumber = tryAsPageNumber((MAX_MEMORY_INDEX - PAGE_SIZE + 1) / PAGE_SIZE);
      const secondPageNumber = tryAsPageNumber(0);
      const bytes = new Uint8Array([1, 2, 3, 4, 5]);
      const firstPage = ReadablePage.new(
        firstPageNumber,
        new Uint8Array([...new Uint8Array(PAGE_SIZE - bytes.length), ...bytes]),
      );
      const secondPage = ReadablePage.new(
        secondPageNumber,
        new Uint8Array([...bytes, ...new Uint8Array(PAGE_SIZE - bytes.length)]),
      );
      const memoryMap = new Map<PageNumber, MemoryPage>();
      memoryMap.set(firstPageNumber, firstPage);
      memoryMap.set(secondPageNumber, secondPage);
      const sbrkIndex = tryAsSbrkIndex(20 * PAGE_SIZE);
      const endHeapIndex = tryAsSbrkIndex(30 * PAGE_SIZE);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const lengthToLoad = 4;
      const result = new Uint8Array(lengthToLoad);
      const addressToLoad = tryAsMemoryIndex(MAX_MEMORY_INDEX - 1);
      const expectedResult = new Uint8Array(lengthToLoad);

      const loadResult = memory.loadInto(result, addressToLoad);

      deepEqual(
        loadResult,
        Result.error(PageFault.fromPageNumber(0, true), () => "Page fault: attempted to access reserved page 0"),
      );
      assert.deepStrictEqual(result, expectedResult);
    });
  });

  describe("storeFrom", () => {
    it("should return PageFault if the page does not exist", () => {
      const memory = Memory.new();
      const addressToStore = tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 1);
      const dataToStore = new Uint8Array([1, 2, 3, 4]);
      const storeResult = memory.storeFrom(addressToStore, dataToStore);

      deepEqual(
        storeResult,
        Result.error(PageFault.fromMemoryIndex(addressToStore), () => "Page fault: page 16 not allocated"),
      );
    });

    it("should not return PageFault if the page does not exist and stored array length is 0 (standard page)", () => {
      const memory = Memory.new();
      const addressToStore = tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 1);

      const storeResult = memory.storeFrom(addressToStore, new Uint8Array());

      assert.deepStrictEqual(storeResult, Result.ok(OK));
    });

    it("should not return PageFault if the page does not exist and stored array length is 0 - even it is a reserved page", () => {
      const memory = Memory.new();
      const addressToStore = tryAsMemoryIndex(1);

      const storeResult = memory.storeFrom(addressToStore, new Uint8Array());

      assert.deepStrictEqual(storeResult, Result.ok(OK));
    });

    it("should correctly store data on one page", () => {
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const page = WriteablePage.new(pageNumber, new Uint8Array());
      const memoryMap = new Map<PageNumber, MemoryPage>();
      const sbrkIndex = tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      memoryMap.set(pageNumber, page);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const dataToStore = new Uint8Array([1, 2, 3, 4]);
```
