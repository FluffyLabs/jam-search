---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-builder.test.ts#L1-L106
title: packages/core/pvm-interpreter/memory/memory-builder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: debf93938d33db5423e3779229373b148974c1bc5b511f711996c73af705d002
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-builder.test.ts` (lines 1–106)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { MEMORY_SIZE } from "@typeberry/pvm-interface";
import { IncorrectSbrkIndex } from "./errors.js";
import { MemoryBuilder } from "./memory-builder.js";
import { PAGE_SIZE, RESERVED_NUMBER_OF_PAGES } from "./memory-consts.js";
import { tryAsMemoryIndex, tryAsSbrkIndex } from "./memory-index.js";
import { ReadablePage, WriteablePage } from "./pages/index.js";
import { tryAsPageNumber } from "./pages/page-utils.js";

describe("MemoryBuilder", () => {
  describe("finalize", () => {
    it("should work correctly (happy path)", () => {
      const builder = new MemoryBuilder();
      const pageMap = new Map();
      pageMap.set(
        RESERVED_NUMBER_OF_PAGES,
        ReadablePage.new(tryAsPageNumber(RESERVED_NUMBER_OF_PAGES), new Uint8Array()),
      );
      pageMap.set(
        RESERVED_NUMBER_OF_PAGES + 1,
        WriteablePage.new(tryAsPageNumber(RESERVED_NUMBER_OF_PAGES + 1), new Uint8Array()),
      );
      const expectedMemory = {
        endHeapIndex: (RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE,
        sbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        virtualSbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        memory: pageMap,
      };

      const memory = builder
        .setReadablePages(
          tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
          new Uint8Array(),
        )
        .setWriteablePages(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          new Uint8Array(),
        )
        .finalize(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE),
        );

      assert.deepEqual(memory, expectedMemory);
    });

    it("should throw IncorrectSbrkIndex exception when some page are in heap segment", () => {
      const builder = new MemoryBuilder();

      const tryToBuildMemory = () =>
        builder
          .setReadablePages(
            tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
            tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
            new Uint8Array(),
          )
          .setWriteablePages(
            tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
            tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
            new Uint8Array(),
          )
          .finalize(
            tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
            tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE),
          );

      assert.throws(tryToBuildMemory, new IncorrectSbrkIndex());
    });

    it("should correctly finalize empty memory with full range heap", () => {
      const builder = new MemoryBuilder();
      const pageMap = new Map();
      const heapStart = RESERVED_NUMBER_OF_PAGES * PAGE_SIZE;
      const heapEnd = MEMORY_SIZE;
      const expectedMemory = {
        endHeapIndex: heapEnd,
        sbrkIndex: heapStart,
        virtualSbrkIndex: heapStart,
        memory: pageMap,
      };

      const memory = builder.finalize(tryAsMemoryIndex(heapStart), tryAsSbrkIndex(heapEnd));

      assert.deepEqual(memory, expectedMemory);
    });
  });

  describe("paged memory", () => {
    it("should add readable page", () => {
      const builder = new MemoryBuilder();
      const pageMap = new Map();
      pageMap.set(
        RESERVED_NUMBER_OF_PAGES,
        ReadablePage.new(tryAsPageNumber(RESERVED_NUMBER_OF_PAGES), new Uint8Array()),
      );
      const expectedMemory = {
        endHeapIndex: (RESERVED_NUMBER_OF_PAGES + 3) * PAGE_SIZE,
        sbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        virtualSbrkIndex: (RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE,
        memory: pageMap,
      };

      const memory = builder
```
