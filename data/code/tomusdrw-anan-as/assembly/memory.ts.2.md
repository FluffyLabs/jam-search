---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.ts#L230-L352'
title: assembly/memory.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 2
chunk_total: 5
content_sha: daf26b4a4e9a496a9dc45bdb0e3901fc74e04fb6aaf8e3366cb8803852c13bbd
language: typescript
---
`assembly/memory.ts` (lines 230–352)

```typescript
    const pages: Page[] = portable.asArray<Page>(this.pages.values());
    for (let i = 0; i < pages.length; i++) {
      this.arena.release(pages[i].raw);
    }
    this.pages.clear();
    this.cache.clear();
  }

  sbrk(faultRes: MaybePageFault, amount: u32): u64 {
    const freeMemoryStart = u64(this.sbrkAddress);
    if (amount === 0) {
      faultRes.isFault = false;
      return freeMemoryStart;
    }

    const newSbrk = portable.u64_add(freeMemoryStart, u64(amount));
    if (newSbrk > this.maxHeapPointer) {
      faultRes.isFault = true;
      return freeMemoryStart;
    }
    this.sbrkAddress = u32(newSbrk);

    const pageIdx = i32(portable.u64_sub(newSbrk, u64(1)) >> u64(PAGE_SIZE_SHIFT));
    if (pageIdx === this.lastAllocatedPage) {
      faultRes.isFault = false;
      return freeMemoryStart;
    }

    for (let i = this.lastAllocatedPage + 1; i <= pageIdx; i++) {
      const rawPage = this.arena.acquire();
      const page = new Page(Access.Write, rawPage);
      this.pages.set(i, page);
      this.cache.insert(i, page);
    }

    this.lastAllocatedPage = pageIdx;
    faultRes.isFault = false;
    return freeMemoryStart;
  }

  getU8(faultRes: MaybePageFault, address: u32): u64 {
    return u64(u8(this.getBytesReversed(faultRes, Access.Read, address, 1)));
  }

  getU16(faultRes: MaybePageFault, address: u32): u64 {
    return u64(portable.bswap_u16(u16(this.getBytesReversed(faultRes, Access.Read, address, 2))));
  }

  getU32(faultRes: MaybePageFault, address: u32): u64 {
    return u64(portable.bswap_u32(u32(this.getBytesReversed(faultRes, Access.Read, address, 4))));
  }

  getU64(faultRes: MaybePageFault, address: u32): u64 {
    return portable.bswap_u64(this.getBytesReversed(faultRes, Access.Read, address, 8));
  }

  getI8(faultRes: MaybePageFault, address: u32): u64 {
    return Inst.u8SignExtend(u8(this.getU8(faultRes, address)));
  }

  getI16(faultRes: MaybePageFault, address: u32): u64 {
    return Inst.u16SignExtend(u16(this.getU16(faultRes, address)));
  }

  getI32(faultRes: MaybePageFault, address: u32): u64 {
    return Inst.u32SignExtend(u32(this.getU32(faultRes, address)));
  }

  setU8(faultRes: MaybePageFault, address: u32, value: u8): void {
    this.setBytes(faultRes, address, value, 1);
  }

  setU16(faultRes: MaybePageFault, address: u32, value: u16): void {
    this.setBytes(faultRes, address, value, 2);
  }

  setU32(faultRes: MaybePageFault, address: u32, value: u32): void {
    this.setBytes(faultRes, address, value, 4);
  }

  setU64(faultRes: MaybePageFault, address: u32, value: u64): void {
    this.setBytes(faultRes, address, value, 8);
  }

  /**
   * DO NOT USE.
   *
   * @deprecated exposed temporarily for debugger/typeberry API.
   */
  getMemory(fault: MaybePageFault, address: u32, length: u32): Uint8Array | null {
    // first traverse memory and see if we don't page fault
    if (length > 0) {
      let nextAddress = address;
      const pagesToCheck = i32(portable.u64_add(u64(length), u64(PAGE_SIZE - 1)) >> u64(PAGE_SIZE_SHIFT));
      for (let page = 0; page < pagesToCheck; page++) {
        const pageData = this.pageResult;
        this.getPage(fault, pageData, Access.Read, nextAddress);
        if (fault.isFault) {
          return null;
        }
        nextAddress += PAGE_SIZE;
      }
    }

    // only after, actually allocate and read the bytes.
    const destination = new Uint8Array(length);
    this.bytesRead(fault, address, destination, 0);
    if (fault.isFault) {
      return null;
    }

    return destination;
  }

  bytesRead(faultRes: MaybePageFault, address: u32, destination: Uint8Array, destinationOffset: u32): void {
    let nextAddress = address;
    let destinationIndex = i32(destinationOffset);

    while (destinationIndex < destination.length) {
      const bytesLeft = destination.length - destinationIndex;
      const pageData = this.pageResult;
      this.getPage(faultRes, pageData, Access.Read, nextAddress);
      if (faultRes.isFault) {
```
