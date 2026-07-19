---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.ts#L119-L238'
title: assembly/memory.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 050ce8f9539d2ae0e65f4ac33dfe11bb119c404e84290fda5658b97b259a6050
language: typescript
---
`assembly/memory.ts` (lines 119–238)

```typescript
      // move to the next address to write
      currentAddress = currentAddress + end;
      currentData = currentData.subarray(end);
    }
    return this;
  }

  /** Returns memory page for given address (creates if not exists) */
  getOrCreatePageForAddress(access: Access, address: u32): Page {
    const pageIdx = u32(address >> PAGE_SIZE_SHIFT);
    if (pageIdx < RESERVED_PAGES) {
      throw new Error(`Attempting to allocate reserved page: ${pageIdx}`);
    }

    if (!this.pages.has(pageIdx)) {
      const page = this.arena.acquire();
      this.pages.set(pageIdx, new Page(access, page));
    }

    return this.pages.get(pageIdx);
  }

  build(sbrkAddress: u32 = RESERVED_MEMORY, maxHeapPointer: u32 = MAX_MEMORY_ADDRESS): Memory {
    return new Memory(this.arena, this.pages, sbrkAddress, maxHeapPointer);
  }
}

export class Memory {
  private lastAllocatedPage: i32;
  private pageResult: PageResult = new PageResult();
  private chunksResult: Chunks = new Chunks();
  private maxHeapPointer: u64;
  private cache: PageCache = new PageCache();

  constructor(
    private readonly arena: Arena,
    public readonly pages: Map<PageIndex, Page> = new Map(),
    private sbrkAddress: u32 = 0,
    maxHeapPointer: u32 = MAX_MEMORY_ADDRESS,
  ) {
    const sbrkPage = u32(sbrkAddress >> PAGE_SIZE_SHIFT);
    if (sbrkPage < RESERVED_PAGES) {
      throw new Error("sbrk within reserved memory is not allowed!");
    }
    this.lastAllocatedPage = pages.has(sbrkPage) ? sbrkPage : sbrkPage - 1;
    this.maxHeapPointer = u64(maxHeapPointer);
    // Pre-populate cache with all existing pages
    // @ts-ignore: AS Map iterator has array-like behavior
    const keys = pages.keys();
    // @ts-ignore: AS Map iterator has array-like behavior
    for (let i = 0; i < keys.length; i++) {
      // @ts-ignore: AS Map iterator has array-like behavior
      const key = keys[i];
      this.cache.insert(key, pages.get(key));
    }
  }

  pageDump(index: PageIndex): Uint8Array | null {
    const cached = this.cache.lookup(index);
    if (cached !== null) {
      return cached.raw.data;
    }
    if (!this.pages.has(index)) {
      return null;
    }
    const page = this.pages.get(index);
    this.cache.insert(index, page);
    return page.raw.data;
  }

  /**
   * Returns the WASM linear memory pointer (byte offset) for the backing buffer of the page at `pageIndex`.
   *
   * Returns `0` if the page does not exist or is not readable (page/access fault).
   *
   * This enables efficient memory reading on the JS side without extra WASM allocations:
   * ```ts
   * let pagesRead = 0;
   * for (let address = start; address < end; address += PAGE_SIZE) {
   *   const page = address >> PAGE_SIZE_SHIFT;
   *   const ptr = getPagePointer(page);
   *   if (ptr === 0) {
   *     throw new Error(`Page fault at ${page << PAGE_SIZE_SHIFT}`);
   *   }
   *   destination.set(
   *     new Uint8Array(wasm.instance.exports.memory.buffer, ptr, Math.min(end - address, PAGE_SIZE)),
   *     pagesRead << PAGE_SIZE_SHIFT,
   *   );
   *   pagesRead += 1;
   * }
   * ```
   */
  getPagePointer(pageIndex: u32): usize {
    let page = this.cache.lookup(pageIndex);
    if (page === null) {
      if (!this.pages.has(pageIndex)) {
        return 0;
      }
      page = this.pages.get(pageIndex);
      this.cache.insert(pageIndex, page);
    }
    if (!page.can(Access.Read)) {
      return 0;
    }
    // Trigger lazy allocation if the backing buffer has not been created yet.
    // @ts-ignore: dataStart is an AS-specific property on Uint8Array
    return page.raw.data.dataStart;
  }

  free(): void {
    // @ts-ignore: AS returns T[], JS returns iterator - asArray handles both
    const pages: Page[] = portable.asArray<Page>(this.pages.values());
    for (let i = 0; i < pages.length; i++) {
      this.arena.release(pages[i].raw);
    }
    this.pages.clear();
    this.cache.clear();
  }

  sbrk(faultRes: MaybePageFault, amount: u32): u64 {
```
