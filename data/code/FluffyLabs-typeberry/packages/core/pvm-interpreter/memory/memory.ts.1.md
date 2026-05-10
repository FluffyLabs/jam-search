---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.ts#L101-L217
title: packages/core/pvm-interpreter/memory/memory.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 02cf4e1b2fadf6abc0c92358a5a40140be1944c060441a00d4c3078bf5e7cca6
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.ts` (lines 101–217)

```typescript
      currentPosition += bytesToWrite;
      bytesLeft -= bytesToWrite;
    }
    return Result.ok(OK);
  }

  private getPages(startAddress: MemoryIndex, length: number, accessType: AccessType): Result<MemoryPage[], PageFault> {
    if (length === 0) {
      return Result.ok([]);
    }

    const memoryRange = MemoryRange.fromStartAndLength(startAddress, length);
    const pageRange = PageRange.fromMemoryRange(memoryRange);

    const pages: MemoryPage[] = [];

    for (const pageNumber of pageRange) {
      if (pageNumber < RESERVED_NUMBER_OF_PAGES) {
        return Result.error(
          PageFault.fromPageNumber(pageNumber, true),
          () => `Page fault: attempted to access reserved page ${pageNumber}`,
        );
      }

      const page = this.memory.get(pageNumber);

      if (page === undefined) {
        return Result.error(PageFault.fromPageNumber(pageNumber), () => `Page fault: page ${pageNumber} not allocated`);
      }

      if (accessType === AccessType.WRITE && !page.isWriteable()) {
        return Result.error(
          PageFault.fromPageNumber(pageNumber, true),
          () => `Page fault: attempted to write to read-only page ${pageNumber}`,
        );
      }

      pages.push(page);
    }

    return Result.ok(pages);
  }
  /**
   * Read content of the memory at `[address, address + result.length)` and
   * write the result into the `result` buffer.
   *
   * Returns `null` if the data was read successfully or `PageFault` otherwise.
   */
  loadInto(result: Uint8Array, startAddress: MemoryIndex): Result<OK, PageFault> {
    if (result.length === 0) {
      return Result.ok(OK);
    }

    const pagesResult = this.getPages(startAddress, result.length, AccessType.READ);

    if (pagesResult.isError) {
      return Result.error(pagesResult.error, pagesResult.details);
    }

    const pages = pagesResult.ok;

    let currentPosition: number = startAddress;
    let bytesLeft = result.length;

    for (const page of pages) {
      const pageStartIndex = tryAsPageIndex(currentPosition % PAGE_SIZE);
      const bytesToRead = Math.min(PAGE_SIZE - pageStartIndex, bytesLeft);
      const destinationStartIndex = currentPosition - startAddress;
      const destination = result.subarray(destinationStartIndex);

      page.loadInto(destination, pageStartIndex, bytesToRead);

      currentPosition += bytesToRead;
      bytesLeft -= bytesToRead;
    }

    logger.insane`MEM[${startAddress}] => ${BytesBlob.blobFrom(result)}`;
    return Result.ok(OK);
  }

  sbrk(length: number): SbrkIndex {
    const currentSbrkIndex = this.sbrkIndex;
    const currentVirtualSbrkIndex = this.virtualSbrkIndex;

    // new sbrk index is bigger than 2 ** 32 or endHeapIndex
    if (MAX_MEMORY_INDEX < currentVirtualSbrkIndex + length || currentVirtualSbrkIndex + length > this.endHeapIndex) {
      throw new OutOfMemory();
    }

    const newVirtualSbrkIndex = tryAsSbrkIndex(this.virtualSbrkIndex + length);

    // no alllocation needed
    if (newVirtualSbrkIndex <= currentSbrkIndex) {
      this.virtualSbrkIndex = newVirtualSbrkIndex;
      return currentVirtualSbrkIndex;
    }

    // standard allocation using "Writeable" pages
    const newSbrkIndex = tryAsSbrkIndex(alignToPageSize(newVirtualSbrkIndex));
    // TODO [MaSi]: `getPageNumber` works incorrectly for SbrkIndex. Sbrk index should be changed to MemoryIndex
    const firstPageNumber = getPageNumber(currentSbrkIndex);
    const pagesToAllocate = (newSbrkIndex - currentSbrkIndex) / PAGE_SIZE;
    const rangeToAllocate = PageRange.fromStartAndLength(firstPageNumber, pagesToAllocate);

    for (const pageNumber of rangeToAllocate) {
      const page = WriteablePage.new(pageNumber);
      this.memory.set(pageNumber, page);
    }

    this.virtualSbrkIndex = newVirtualSbrkIndex;
    this.sbrkIndex = newSbrkIndex;
    return currentVirtualSbrkIndex;
  }

  getPageDump(pageNumber: PageNumber) {
    const page = this.memory.get(pageNumber);
    return page?.getPageDump() ?? null;
```
