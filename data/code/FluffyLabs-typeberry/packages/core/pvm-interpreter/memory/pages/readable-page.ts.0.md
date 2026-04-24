---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/pages/readable-page.ts#L1-L54
title: packages/core/pvm-interpreter/memory/pages/readable-page.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5be867b447947ca1c5ffa10db3fef99ac765d637d1aa7dc0d3f527a93f7c0b0d
language: typescript
---
`packages/core/pvm-interpreter/memory/pages/readable-page.ts` (lines 1–54)

```typescript
import { OK, Result } from "@typeberry/utils";
import { PageFault } from "../errors.js";
import { PAGE_SIZE } from "../memory-consts.js";
import { MemoryPage } from "./memory-page.js";
import type { PageIndex, PageNumber } from "./page-utils.js";

export class ReadablePage extends MemoryPage {
  static new(pageNumber: PageNumber, data: Uint8Array) {
    return new ReadablePage(pageNumber, data);
  }

  private constructor(
    pageNumber: PageNumber,
    private data: Uint8Array,
  ) {
    super(pageNumber);
  }

  loadInto(result: Uint8Array, startIndex: PageIndex, length: number): Result<OK, PageFault> {
    const endIndex = startIndex + length;
    if (endIndex > PAGE_SIZE) {
      return Result.error(
        PageFault.fromMemoryIndex(this.start + PAGE_SIZE),
        () => `Page fault: read beyond page boundary at ${this.start + PAGE_SIZE}`,
      );
    }

    const bytes = this.data.subarray(startIndex, endIndex);
    // we zero the bytes, since data might not yet be initialized at `endIndex`.
    result.fill(0, bytes.length, length);
    result.set(bytes);

    return Result.ok(OK);
  }

  storeFrom(_address: PageIndex, _data: Uint8Array): Result<OK, PageFault> {
    return Result.error(
      PageFault.fromMemoryIndex(this.start, true),
      () => `Page fault: attempted to write to read-only page at ${this.start}`,
    );
  }

  setData(pageIndex: PageIndex, data: Uint8Array) {
    this.data.set(data, pageIndex);
  }

  isWriteable() {
    return false;
  }

  getPageDump() {
    return this.data;
  }
}
```
