---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.ts#L348-L471'
title: assembly/memory.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 1951178033893fc514d5ed4fe9b60c32dd084a23ce38ff296d07c24d8cc9a01b
language: typescript
---
`assembly/memory.ts` (lines 348–471)

```typescript
    while (destinationIndex < destination.length) {
      const bytesLeft = destination.length - destinationIndex;
      const pageData = this.pageResult;
      this.getPage(faultRes, pageData, Access.Read, nextAddress);
      if (faultRes.isFault) {
        return;
      }
      const relAddress = pageData.relativeAddress;
      const bytesToRead = relAddress + bytesLeft < PAGE_SIZE ? bytesLeft : PAGE_SIZE - pageData.relativeAddress;
      // actually copy the bytes
      const pageEnd = relAddress + bytesToRead;
      const data = pageData.page.raw.data;
      for (let i = relAddress; i < pageEnd; i++) {
        destination[destinationIndex] = data[i];
        destinationIndex++;
      }
      // move the pointers
      nextAddress += bytesToRead;
    }

    return;
  }

  /** Write bytes from given `source` (with `sourceOffset`) at given `address`. */
  bytesWrite(faultRes: MaybePageFault, address: u32, source: Uint8Array, sourceOffset: u32): void {
    let nextAddress = address;
    let sourceIndex = i32(sourceOffset);

    while (sourceIndex < source.length) {
      const bytesLeft = source.length - sourceIndex;
      const pageData = this.pageResult;
      this.getPage(faultRes, pageData, Access.Write, nextAddress);
      if (faultRes.isFault) {
        return;
      }
      const relAddress = pageData.relativeAddress;
      const bytesToWrite = relAddress + bytesLeft < PAGE_SIZE ? bytesLeft : PAGE_SIZE - pageData.relativeAddress;
      // actually copy the bytes
      const pageEnd = relAddress + bytesToWrite;
      const data = pageData.page.raw.data;
      for (let i = relAddress; i < pageEnd; i++) {
        data[i] = source[sourceIndex];
        sourceIndex++;
      }
      // move the pointers
      nextAddress += bytesToWrite;
    }

    return;
  }

  private getPage(faultRes: MaybePageFault, pageData: PageResult, access: Access, address: u32): void {
    const pageIdx = u32(address >> PAGE_SIZE_SHIFT);
    const relAddress = address & (PAGE_SIZE - 1);

    // Fast path: check cache first
    const cached = this.cache.lookup(pageIdx);
    if (cached !== null) {
      if (!cached.can(access)) {
        fault(faultRes, pageIdx << PAGE_SIZE_SHIFT);
        faultRes.isAccess = true;
        pageData.page = EMPTY_PAGE;
        pageData.relativeAddress = relAddress;
        return;
      }
      faultRes.isFault = false;
      pageData.page = cached;
      pageData.relativeAddress = relAddress;
      return;
    }

    // Slow path: check Map
    if (!this.pages.has(pageIdx)) {
      fault(faultRes, pageIdx << PAGE_SIZE_SHIFT);
      pageData.page = EMPTY_PAGE;
      pageData.relativeAddress = relAddress;
      return;
    }

    const page = this.pages.get(pageIdx);
    // Insert into cache for next time
    this.cache.insert(pageIdx, page);

    if (!page.can(access)) {
      fault(faultRes, pageIdx << PAGE_SIZE_SHIFT);
      faultRes.isAccess = true;
      pageData.page = EMPTY_PAGE;
      pageData.relativeAddress = relAddress;
      return;
    }

    faultRes.isFault = false;
    pageData.page = page;
    pageData.relativeAddress = relAddress;
    return;
  }

  private getChunks(faultRes: MaybePageFault, chunks: Chunks, access: Access, address: u32, bytes: u8): void {
    /**
     * Accessing empty set of bytes is always valid.
     * https://graypaper.fluffylabs.dev/#/68eaa1f/24a80024a800?v=0.6.4
     */
    if (bytes === 0) {
      faultRes.isFault = false;
      chunks.firstPageData = EMPTY_UINT8ARRAY;
      chunks.firstPageOffset = 0;
      chunks.secondPageData = EMPTY_UINT8ARRAY;
      chunks.secondPageEnd = 0;
      return;
    }

    const pageData = this.pageResult;
    this.getPage(faultRes, pageData, access, address);
    if (faultRes.isFault) {
      return;
    }

    const page = pageData.page;
    const relativeAddress = pageData.relativeAddress;

    const endAddress = relativeAddress + u32(bytes);
    const needSecondPage = endAddress > PAGE_SIZE;

    // everything is on one page - easy case
```
