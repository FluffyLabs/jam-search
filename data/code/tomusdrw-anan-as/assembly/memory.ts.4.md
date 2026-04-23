---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.ts#L466-L554'
title: assembly/memory.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 4
chunk_total: 5
content_sha: b54ea2becaab5f63d47afb108317d06befc1c59069927c64de5af9b8601b5461
language: typescript
---
`assembly/memory.ts` (lines 466–554)

```typescript
    const relativeAddress = pageData.relativeAddress;

    const endAddress = relativeAddress + u32(bytes);
    const needSecondPage = endAddress > PAGE_SIZE;

    // everything is on one page - easy case
    if (!needSecondPage) {
      chunks.firstPageData = page.raw.data;
      chunks.firstPageOffset = relativeAddress;
      return;
    }

    const secondPageIdx = u32((address + u32(bytes)) % MEMORY_SIZE) >> PAGE_SIZE_SHIFT;
    const secondPageStart = secondPageIdx << PAGE_SIZE_SHIFT;

    // Try cache first for second page
    let secondPage = this.cache.lookup(secondPageIdx);
    if (secondPage === null) {
      if (!this.pages.has(secondPageIdx)) {
        fault(faultRes, secondPageStart);
        return;
      }
      secondPage = this.pages.get(secondPageIdx);
      this.cache.insert(secondPageIdx, secondPage);
    }
    if (!secondPage.can(access)) {
      fault(faultRes, secondPageStart);
      faultRes.isAccess = true;
      return;
    }

    chunks.firstPageData = page.raw.data;
    chunks.firstPageOffset = relativeAddress;
    chunks.secondPageData = secondPage.raw.data;
    chunks.secondPageEnd = relativeAddress + u32(bytes) - PAGE_SIZE;
    return;
  }

  /** Write some bytes to at most 2 pages. */
  private setBytes(faultRes: MaybePageFault, address: u32, value: u64, bytes: u8): void {
    const r = this.chunksResult;
    this.getChunks(faultRes, r, Access.Write, address, bytes);
    if (faultRes.isFault) {
      return;
    }

    let bytesLeft = u64(value);
    // write to first page
    const firstPageEnd = IntMath.minU32(PAGE_SIZE, r.firstPageOffset + bytes);
    for (let i: u32 = r.firstPageOffset; i < firstPageEnd; i++) {
      r.firstPageData[i] = u8(bytesLeft);
      bytesLeft >>= u64(8);
    }
    // write rest to the second page
    for (let i: u32 = 0; i < r.secondPageEnd; i++) {
      r.secondPageData[i] = u8(bytesLeft);
      bytesLeft >>= u64(8);
    }
  }

  private getBytesReversed(faultRes: MaybePageFault, access: Access, address: u32, bytes: u8): u64 {
    this.getChunks(faultRes, this.chunksResult, access, address, bytes);
    if (faultRes.isFault) {
      return u64(0);
    }

    // result (bytes in reverse order)
    let r: u64 = u64(0);
    const firstPageEnd = IntMath.minU32(PAGE_SIZE, this.chunksResult.firstPageOffset + bytes);

    // read from first page
    for (let i: u32 = this.chunksResult.firstPageOffset; i < firstPageEnd; i++) {
      r = (r << u64(8)) | u64(this.chunksResult.firstPageData[i]);
    }

    // read from the second page
    for (let i: u32 = 0; i < this.chunksResult.secondPageEnd; i++) {
      r = (r << u64(8)) | u64(this.chunksResult.secondPageData[i]);
    }

    return r;
  }
}

function fault(r: MaybePageFault, address: u32): void {
  r.isFault = true;
  r.isAccess = false;
  r.fault = address;
}
```
