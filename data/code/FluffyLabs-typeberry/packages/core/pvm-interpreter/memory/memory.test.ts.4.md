---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.test.ts#L340-L382
title: packages/core/pvm-interpreter/memory/memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 1eb1d4039a1e1bf9746e4973148e9d5cd5255f20e9310e8b44b3eb2772cb8b18
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.test.ts` (lines 340–382)

```typescript
      memory.sbrk(lengthToAllocate);

      assert.deepEqual(memory, expectedMemoryAfterFirstAllocation);

      const expectedMemoryAfterSecondAllocation = {
        sbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + PAGE_SIZE,
        virtualSbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 2 * lengthToAllocate,
        endHeapIndex: MAX_MEMORY_INDEX,
        memory: expectedMemoryMap,
      };

      memory.sbrk(lengthToAllocate);

      assert.deepEqual(memory, expectedMemoryAfterSecondAllocation);
    });

    it("should allocate two pages one by one", () => {
      const memory = Memory.new();
      const lengthToAllocate = PAGE_SIZE;
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
        virtualSbrkIndex: RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 2 * PAGE_SIZE,
        endHeapIndex: MAX_MEMORY_INDEX,
        memory: expectedMemoryMap,
      };

      memory.sbrk(lengthToAllocate);
      memory.sbrk(lengthToAllocate);

      assert.deepEqual(memory, expectedMemory);
    });
  });
});
```
