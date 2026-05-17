---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-builder.ts#L1-L97
title: packages/core/pvm-interpreter/memory/memory-builder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: f0c1b0f5d0d348a1d1120c03126558b73ff0095d00259c6f891c20c5c01248e5
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-builder.ts` (lines 1–97)

```typescript
import { check } from "@typeberry/utils";
import { FinalizedBuilderModification, IncorrectSbrkIndex, PageNotExist, ReservedMemoryFault } from "./errors.js";
import { Memory } from "./memory.js";
import { PAGE_SIZE } from "./memory-consts.js";
import { type MemoryIndex, type SbrkIndex, tryAsSbrkIndex } from "./memory-index.js";
import { MemoryRange, RESERVED_MEMORY_RANGE } from "./memory-range.js";
import { getPageNumber } from "./memory-utils.js";
import { PageRange } from "./page-range.js";
import { ReadablePage, WriteablePage } from "./pages/index.js";
import type { MemoryPage } from "./pages/memory-page.js";
import { type PageNumber, tryAsPageIndex } from "./pages/page-utils.js";

export class MemoryBuilder {
  private readonly initialMemory: Map<PageNumber, MemoryPage> = new Map();
  private isFinalized = false;

  private ensureNotFinalized() {
    if (this.isFinalized) {
      throw new FinalizedBuilderModification();
    }
  }

  private ensureNoReservedMemoryUsage(range: MemoryRange) {
    if (range.overlapsWith(RESERVED_MEMORY_RANGE)) {
      throw new ReservedMemoryFault();
    }
  }

  /**
   * Create entire readable pages to handle the `[start, end)` range.
   *
   * Note that both `start` and `end` must be multiple of the `PAGE_SIZE`, i.e.
   * they need to be the start indices of the pages.
   *
   * The data passed will be placed at `start`, but might be shorter than the requested range,
   * prepend it with zeros if you don't wish to have it at the beginning of the page.
   */
  setReadablePages(start: MemoryIndex, end: MemoryIndex, data: Uint8Array = new Uint8Array()) {
    this.ensureNotFinalized();
    check`${start < end} end has to be bigger than start`;
    check`${start % PAGE_SIZE === 0} start needs to be a multiple of page size (${PAGE_SIZE})`;
    check`${end % PAGE_SIZE === 0} end needs to be a multiple of page size (${PAGE_SIZE})`;
    check`${data.length <= end - start} the initial data is longer than address range`;

    const length = end - start;
    const range = MemoryRange.fromStartAndLength(start, length);

    this.ensureNoReservedMemoryUsage(range);

    const pages = Array.from(PageRange.fromMemoryRange(range));
    const noOfPages = pages.length;

    for (let i = 0; i < noOfPages; i++) {
      const pageNumber = pages[i];
      const dataChunk = data.subarray(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
      const page = ReadablePage.new(pageNumber, dataChunk);
      this.initialMemory.set(pageNumber, page);
    }

    return this;
  }

  /**
   * Create entire writeable pages to handle the `[start, end)` range.
   *
   * Note that both `start` and `end` must be multiple of the `PAGE_SIZE`, i.e.
   * they need to be the start indices of the pages.
   *
   * The data passed will be placed at `start`, but might be shorter than the requested range,
   * prepend it with zeros if you don't wish to have it at the beginning of the page.
   */
  setWriteablePages(start: MemoryIndex, end: MemoryIndex, data: Uint8Array = new Uint8Array()) {
    this.ensureNotFinalized();
    check`${start < end} end has to be bigger than start`;
    check`${start % PAGE_SIZE === 0} start needs to be a multiple of page size (${PAGE_SIZE})`;
    check`${end % PAGE_SIZE === 0} end needs to be a multiple of page size (${PAGE_SIZE})`;
    check`${data.length <= end - start} the initial data is longer than address range`;

    const length = end - start;
    const range = MemoryRange.fromStartAndLength(start, length);

    this.ensureNoReservedMemoryUsage(range);

    const pages = Array.from(PageRange.fromMemoryRange(range));
    const noOfPages = pages.length;

    for (let i = 0; i < noOfPages; i++) {
      const pageNumber = pages[i];
      const dataChunk = data.subarray(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
      const page = WriteablePage.new(pageNumber, dataChunk);
      this.initialMemory.set(pageNumber, page);
    }

    return this;
  }

  /**
```
