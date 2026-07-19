---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.ts#L1-L126'
title: assembly/memory.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 0
chunk_total: 5
content_sha: bb9b96d6a38033b2280a82062545767cb7ef29e6b8174df2848e9c3518d96e21
language: typescript
---
`assembly/memory.ts` (lines 1–126)

```typescript
import { Inst } from "./instructions/utils";
import { IntMath } from "./math";
import {
  Access,
  Arena,
  PAGE_SIZE,
  PAGE_SIZE_SHIFT,
  Page,
  PageIndex,
  RawPage,
  RESERVED_MEMORY,
  RESERVED_PAGES,
} from "./memory-page";
import { portable } from "./portable";

// @unmanaged
export class MaybePageFault {
  /** Accessing memory triggered a page fault. */
  isFault: boolean = false;
  /** The page fault was caused by invalid memory access (i.e. writing to read-only memory). */
  isAccess: boolean = false;
  /** Start memory index of a page that triggered the fault. */
  fault: u32 = 0;
}

const EMPTY_UINT8ARRAY = new Uint8Array(0);
const EMPTY_PAGE = new Page(Access.None, new RawPage(-1, EMPTY_UINT8ARRAY));

class Chunks {
  firstPageData: Uint8Array = EMPTY_UINT8ARRAY;
  firstPageOffset: u32 = 0;
  secondPageData: Uint8Array = EMPTY_UINT8ARRAY;
  secondPageEnd: u32 = 0;
}

class PageResult {
  page: Page = EMPTY_PAGE;
  relativeAddress: u32 = 0;
}

const MEMORY_SIZE = 0x1_0000_0000;
const MAX_MEMORY_ADDRESS: u32 = 0xffff_ffff;

// Direct-mapped page cache for fast lookups.
// Cache size must be a power of 2. 256 entries covers most working sets.
const PAGE_CACHE_SHIFT: u32 = 8;
const PAGE_CACHE_SIZE: u32 = 1 << PAGE_CACHE_SHIFT; // 256
const PAGE_CACHE_MASK: u32 = PAGE_CACHE_SIZE - 1;

class PageCache {
  // Parallel arrays for cache: tags store the page index, entries store the page.
  // A tag of 0xFFFFFFFF means empty (no valid page).
  private tags: StaticArray<u32> = new StaticArray<u32>(PAGE_CACHE_SIZE);
  private entries: StaticArray<Page> = new StaticArray<Page>(PAGE_CACHE_SIZE);

  constructor() {
    const empty = EMPTY_PAGE;
    for (let i: u32 = 0; i < PAGE_CACHE_SIZE; i++) {
      this.tags[i] = 0xffffffff;
      this.entries[i] = empty;
    }
  }

  @inline
  lookup(pageIdx: u32): Page | null {
    const slot = pageIdx & PAGE_CACHE_MASK;
    if (unchecked(this.tags[slot]) === pageIdx) {
      return unchecked(this.entries[slot]);
    }
    return null;
  }

  @inline
  insert(pageIdx: u32, page: Page): void {
    const slot = pageIdx & PAGE_CACHE_MASK;
    // biome-ignore lint/suspicious/noAssignInExpressions: intentional AS pattern
    unchecked((this.tags[slot] = pageIdx));
    // biome-ignore lint/suspicious/noAssignInExpressions: intentional AS pattern
    unchecked((this.entries[slot] = page));
  }

  clear(): void {
    for (let i: u32 = 0; i < PAGE_CACHE_SIZE; i++) {
      this.tags[i] = 0xffffffff;
      this.entries[i] = EMPTY_PAGE;
    }
  }
}

export class MemoryBuilder {
  private readonly pages: Map<PageIndex, Page> = new Map();
  private readonly arena: Arena;

  constructor(preAllocatePages: u32 = 0) {
    this.arena = new Arena(preAllocatePages);
  }

  /** Allocates memory pages with given `access`, for given `address` and initialize with `zeroes` */
  setEmpty(access: Access, address: u32, len: u32): MemoryBuilder {
    const endAddress = address + len;
    for (let currentAddress = address; currentAddress < endAddress; currentAddress += PAGE_SIZE) {
      this.getOrCreatePageForAddress(access, currentAddress);
    }
    return this;
  }

  /** Allocates memory pages with given `access`, for given `address` and writes there `data` */
  setData(access: Access, address: u32, data: Uint8Array): MemoryBuilder {
    let currentAddress = address;
    let currentData = data;
    while (currentData.length > 0) {
      const page = this.getOrCreatePageForAddress(access, currentAddress);

      const relAddress = currentAddress % PAGE_SIZE;
      const spaceInPage = PAGE_SIZE - relAddress;
      const end = u32(currentData.length) < spaceInPage ? currentData.length : spaceInPage;
      page.raw.data.set(currentData.subarray(0, end), relAddress);

      // move to the next address to write
      currentAddress = currentAddress + end;
      currentData = currentData.subarray(end);
    }
    return this;
  }

  /** Returns memory page for given address (creates if not exists) */
```
