---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.test.ts#L1-L82
title: packages/core/pvm-interpreter/memory/memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 5
content_sha: 49922a1e51f86fdd87ae2db788e6e6b23a272a488c455fa204af147792fb555e
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.test.ts` (lines 1–82)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { MAX_MEMORY_INDEX } from "@typeberry/pvm-interface";
import { deepEqual, OK, Result } from "@typeberry/utils";
import { PageFault } from "./errors.js";
import { Memory } from "./memory.js";
import { MIN_ALLOCATION_LENGTH, PAGE_SIZE, RESERVED_NUMBER_OF_PAGES } from "./memory-consts.js";
import { tryAsMemoryIndex, tryAsSbrkIndex } from "./memory-index.js";
import { ReadablePage, WriteablePage } from "./pages/index.js";
import type { MemoryPage } from "./pages/memory-page.js";
import { type PageNumber, tryAsPageNumber } from "./pages/page-utils.js";

describe("Memory", () => {
  describe("loadInto", () => {
    it("should return PageFault if the page does not exist", () => {
      const memory = Memory.new();
      const lengthToLoad = 4;
      const result = new Uint8Array(lengthToLoad);
      const addressToLoad = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);

      const loadResult = memory.loadInto(result, addressToLoad);

      deepEqual(
        loadResult,
        Result.error(PageFault.fromMemoryIndex(addressToLoad), () => "Page fault: page 16 not allocated"),
      );
    });

    it("should correctly load data from one page", () => {
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const bytes = new Uint8Array([1, 2, 3, 4, 5]);
      const page = ReadablePage.new(pageNumber, bytes);
      const memoryMap = new Map<PageNumber, MemoryPage>();
      memoryMap.set(pageNumber, page);
      const sbrkIndex = tryAsSbrkIndex(20 * PAGE_SIZE);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const lengthToLoad = 4;
      const result = new Uint8Array(lengthToLoad);
      const addressToLoad = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const expectedResult = bytes.subarray(addressToLoad % PAGE_SIZE, (addressToLoad % PAGE_SIZE) + lengthToLoad);

      const loadResult = memory.loadInto(result, addressToLoad);

      assert.deepStrictEqual(loadResult, Result.ok(OK));
      assert.deepStrictEqual(result, expectedResult);
    });

    it("should correctly load data from two pages", () => {
      const firstPageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const secondPageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES + 1);
      const bytes = new Uint8Array([1, 2, 3, 4, 5]);
      const firstPage = ReadablePage.new(
        firstPageNumber,
        new Uint8Array([...new Uint8Array(PAGE_SIZE - bytes.length), ...bytes]),
      );
      const secondPage = ReadablePage.new(secondPageNumber, bytes);
      const memoryMap = new Map<PageNumber, MemoryPage>();
      memoryMap.set(firstPageNumber, firstPage);
      memoryMap.set(secondPageNumber, secondPage);
      const sbrkIndex = tryAsSbrkIndex(20 * PAGE_SIZE);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
      const memory = Memory.fromInitialMemory({ memory: memoryMap, sbrkIndex, endHeapIndex });
      const lengthToLoad = 4;
      const result = new Uint8Array(lengthToLoad);
      const addressToLoad = tryAsMemoryIndex(secondPageNumber * PAGE_SIZE - 2);
      const expectedResult = new Uint8Array([4, 5, 1, 2]);

      const loadResult = memory.loadInto(result, addressToLoad);

      assert.deepStrictEqual(loadResult, Result.ok(OK));
      assert.deepStrictEqual(result, expectedResult);
    });

    it("should return PageFault if case of loading data from 2 pages but one of them does not exist", () => {
      const pageNumber = tryAsPageNumber(RESERVED_NUMBER_OF_PAGES);
      const bytes = new Uint8Array();
      const page = ReadablePage.new(pageNumber, bytes);
      const memoryMap = new Map<PageNumber, MemoryPage>();
      memoryMap.set(pageNumber, page);
      const sbrkIndex = tryAsSbrkIndex(0);
      const endHeapIndex = tryAsSbrkIndex(MAX_MEMORY_INDEX);
```
