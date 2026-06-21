---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/pages/memory-page.ts#L1-L41
title: packages/core/pvm-interpreter/memory/pages/memory-page.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 3769536534e741823c8776271eb51c5900bd29004c0af0746a28e15a957047a5
language: typescript
---
`packages/core/pvm-interpreter/memory/pages/memory-page.ts` (lines 1–41)

```typescript
import type { OK, Result } from "@typeberry/utils";
import type { PageFault } from "../errors.js";
import type { MemoryIndex } from "../memory-index.js";
import { getStartPageIndexFromPageNumber } from "../memory-utils.js";
import type { PageIndex, PageNumber } from "./page-utils.js";

export abstract class MemoryPage {
  public start: MemoryIndex;

  constructor(pageNumber: PageNumber) {
    this.start = getStartPageIndexFromPageNumber(pageNumber);
  }

  /** Returns `true` if the page is writeable. */
  abstract isWriteable(): boolean;

  /**
   * Load exactly `length` bytes from memory page, starting at index `address`
   * into the `res` array.
   *
   * Note that the `res` might be bigger than the number of bytes length, but cannot be smaller.
   *
   * Returns `null` if copying was successful and [`PageFault`] otherwise.
   * NOTE That the `result` might be partially modified in case `PageFault` occurs!
   */
  abstract loadInto(res: Uint8Array, address: PageIndex, length: number): Result<OK, PageFault>;

  /**
   * Copy all bytes from the `data` into the page at index `address`.
   *
   * Returns `null` if copying was successful and [`PageFault`] otherwise.
   */
  abstract storeFrom(address: PageIndex, data: Uint8Array): Result<OK, PageFault>;
  /**
   * Get dump of the entire page. Should only be used for the debugger-adapter because it
   * might be inefficient.
   */
  abstract getPageDump(): Uint8Array;

  abstract setData(pageIndex: PageIndex, data: Uint8Array): void;
}
```
