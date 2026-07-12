---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.ts#L1-L107
title: packages/core/pvm-interpreter/memory/memory.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 526b035d0a35cca26140f4beb3c919c3c44032eca7b938af12301594773d14b0
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.ts` (lines 1–107)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import { Logger } from "@typeberry/logger";
import type { U32 } from "@typeberry/numbers";
import { type IMemory, type PageFault as InretpreterPageFault, MAX_MEMORY_INDEX } from "@typeberry/pvm-interface";
import { OK, Result } from "@typeberry/utils";
import { OutOfMemory, PageFault } from "./errors.js";
import { PAGE_SIZE, RESERVED_NUMBER_OF_PAGES } from "./memory-consts.js";
import { type MemoryIndex, type SbrkIndex, tryAsMemoryIndex, tryAsSbrkIndex } from "./memory-index.js";
import { MemoryRange, RESERVED_MEMORY_RANGE } from "./memory-range.js";
import { alignToPageSize, getPageNumber } from "./memory-utils.js";
import { PageRange } from "./page-range.js";
import { WriteablePage } from "./pages/index.js";
import type { MemoryPage } from "./pages/memory-page.js";
import { type PageNumber, tryAsPageIndex } from "./pages/page-utils.js";

type InitialMemoryState = {
  memory: Map<PageNumber, MemoryPage>;
  sbrkIndex: SbrkIndex;
  endHeapIndex: SbrkIndex;
};

enum AccessType {
  READ = 0,
  WRITE = 1,
}

const logger = Logger.new(import.meta.filename, "pvm:mem");

export class Memory implements IMemory {
  static fromInitialMemory(initialMemoryState: InitialMemoryState) {
    return new Memory(
      initialMemoryState?.sbrkIndex,
      initialMemoryState?.sbrkIndex,
      initialMemoryState?.endHeapIndex,
      initialMemoryState?.memory,
    );
  }

  static new(
    sbrkIndex = tryAsSbrkIndex(RESERVED_MEMORY_RANGE.end),
    virtualSbrkIndex = tryAsSbrkIndex(RESERVED_MEMORY_RANGE.end),
    endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX),
    memory = new Map<PageNumber, MemoryPage>(),
  ) {
    return new Memory(sbrkIndex, virtualSbrkIndex, endHeapIndex, memory);
  }

  private constructor(
    private sbrkIndex = tryAsSbrkIndex(RESERVED_MEMORY_RANGE.end),
    private virtualSbrkIndex = tryAsSbrkIndex(RESERVED_MEMORY_RANGE.end),
    private endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX),
    private memory = new Map<PageNumber, MemoryPage>(),
  ) {}

  store(address: U32, bytes: Uint8Array): Result<OK, InretpreterPageFault> {
    return this.storeFrom(tryAsMemoryIndex(address), bytes);
  }

  read(address: U32, output: Uint8Array): Result<OK, InretpreterPageFault> {
    return this.loadInto(output, tryAsMemoryIndex(address));
  }

  reset() {
    this.sbrkIndex = tryAsSbrkIndex(RESERVED_MEMORY_RANGE.end);
    this.virtualSbrkIndex = tryAsSbrkIndex(RESERVED_MEMORY_RANGE.end);
    this.endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
    this.memory = new Map<PageNumber, MemoryPage>(); // TODO [MaSi]: We should keep allocated pages somewhere and reuse it when it is possible
  }

  copyFrom(memory: Memory) {
    this.sbrkIndex = memory.sbrkIndex;
    this.virtualSbrkIndex = memory.virtualSbrkIndex;
    this.endHeapIndex = memory.endHeapIndex;
    this.memory = memory.memory;
  }

  storeFrom(address: MemoryIndex, bytes: Uint8Array): Result<OK, PageFault> {
    if (bytes.length === 0) {
      return Result.ok(OK);
    }

    logger.insane`MEM[${address}] <- ${BytesBlob.blobFrom(bytes)}`;
    const pagesResult = this.getPages(address, bytes.length, AccessType.WRITE);

    if (pagesResult.isError) {
      return Result.error(pagesResult.error, pagesResult.details);
    }

    const pages = pagesResult.ok;
    let currentPosition: number = address;
    let bytesLeft = bytes.length;

    for (const page of pages) {
      const pageStartIndex = tryAsPageIndex(currentPosition % PAGE_SIZE);
      const bytesToWrite = Math.min(PAGE_SIZE - pageStartIndex, bytesLeft);
      const sourceStartIndex = currentPosition - address;
      const source = bytes.subarray(sourceStartIndex, sourceStartIndex + bytesToWrite);

      page.storeFrom(pageStartIndex, source);

      currentPosition += bytesToWrite;
      bytesLeft -= bytesToWrite;
    }
    return Result.ok(OK);
  }

  private getPages(startAddress: MemoryIndex, length: number, accessType: AccessType): Result<MemoryPage[], PageFault> {
```
