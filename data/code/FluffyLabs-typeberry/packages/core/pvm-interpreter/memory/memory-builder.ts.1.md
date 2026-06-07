---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-builder.ts#L89-L151
title: packages/core/pvm-interpreter/memory/memory-builder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 21011815799c679ae719ca05d87bb8f7ee9c977d4981f8bfdd9c7f145ca8a938
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-builder.ts` (lines 89–151)

```typescript
      const dataChunk = data.subarray(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
      const page = WriteablePage.new(pageNumber, dataChunk);
      this.initialMemory.set(pageNumber, page);
    }

    return this;
  }

  /**
   * This function can be useful when page map and initial memory data are provided separatelly.
   * You can use setWriteablePages/setReadablePages to create empty pages and then setData to fill them
   */
  setData(start: MemoryIndex, data: Uint8Array) {
    this.ensureNotFinalized();
    const pageOffset = start % PAGE_SIZE;
    const remainingSpaceOnPage = PAGE_SIZE - pageOffset;
    check`${data.length <= remainingSpaceOnPage} The data has to fit into a single page.`;

    const length = data.length;
    const range = MemoryRange.fromStartAndLength(start, length);

    this.ensureNoReservedMemoryUsage(range);

    const pageNumber = getPageNumber(start);
    const page = this.initialMemory.get(pageNumber);

    if (page === undefined) {
      throw new PageNotExist();
    }

    const startPageIndex = tryAsPageIndex(start - page.start);
    page.setData(startPageIndex, data);

    return this;
  }

  finalize(startHeapIndex: MemoryIndex, endHeapIndex: SbrkIndex): Memory {
    check`
      ${startHeapIndex <= endHeapIndex}
      startHeapIndex (${startHeapIndex}) has to be less than or equal to endHeapIndex (${endHeapIndex})
    `;
    this.ensureNotFinalized();

    const heapRange = MemoryRange.fromStartAndLength(startHeapIndex, endHeapIndex - startHeapIndex);
    const heapPagesRange = PageRange.fromMemoryRange(heapRange);
    const initializedPageNumbers = Array.from(this.initialMemory.keys());

    for (const pageNumber of initializedPageNumbers) {
      if (heapPagesRange.isInRange(pageNumber)) {
        throw new IncorrectSbrkIndex();
      }
    }

    const memory = Memory.fromInitialMemory({
      memory: this.initialMemory,
      sbrkIndex: tryAsSbrkIndex(startHeapIndex),
      endHeapIndex,
    });

    this.isFinalized = true;
    return memory;
  }
}
```
