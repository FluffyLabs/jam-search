---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/pvm.ts#L1-L115
title: bin/test-runner/w3f/pvm.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: 5a7886a91fd6ca6ec68006eec351e7bea7dccd4fe286c4df20085ba3f48920d9
language: typescript
---
`bin/test-runner/w3f/pvm.ts` (lines 1–115)

```typescript
import assert from "node:assert";
import { fromJson } from "@typeberry/block-json";
import { type FromJson, json } from "@typeberry/json-parser";
import { MAX_MEMORY_INDEX, Status, tryAsGas } from "@typeberry/pvm-interface";
import { Interpreter } from "@typeberry/pvm-interpreter";
import { MemoryBuilder } from "@typeberry/pvm-interpreter/memory/index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/memory/memory-consts.js";
import { tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { getPageNumber } from "@typeberry/pvm-interpreter/memory/memory-utils.js";
import { type PageNumber, tryAsPageNumber } from "@typeberry/pvm-interpreter/memory/pages/page-utils.js";
import { Registers } from "@typeberry/pvm-interpreter/registers.js";
import { safeAllocUint8Array } from "@typeberry/utils";

class MemoryChunkItem {
  static fromJson: FromJson<MemoryChunkItem> = {
    address: "number",
    contents: fromJson.uint8Array,
  };
  address!: number;
  contents!: Uint8Array;
}

class PageMapItem {
  static fromJson: FromJson<PageMapItem> = {
    address: "number",
    length: "number",
    "is-writable": "boolean",
  };
  address!: number;
  length!: number;
  "is-writable": boolean;
}
export class PvmTest {
  static fromJson: FromJson<PvmTest> = {
    name: "string",
    "initial-regs": fromJson.bigUint64Array,
    "initial-pc": "number",
    "initial-page-map": json.array(PageMapItem.fromJson),
    "initial-memory": json.array(MemoryChunkItem.fromJson),
    "initial-gas": "number",
    program: fromJson.uint8Array,
    "expected-status": "string",
    "expected-regs": fromJson.bigUint64Array,
    "expected-pc": "number",
    "expected-memory": json.array(MemoryChunkItem.fromJson),
    "expected-gas": "number",
    "expected-page-fault-address": json.optional("number"),
  };

  name!: string;
  "initial-regs": BigUint64Array;
  "initial-pc": number;
  "initial-page-map": PageMapItem[];
  "initial-memory": MemoryChunkItem[];
  "initial-gas": number;
  program!: Uint8Array;
  "expected-status": string;
  "expected-regs": BigUint64Array;
  "expected-pc": number;
  "expected-memory": MemoryChunkItem[];
  "expected-gas": number;
  "expected-page-fault-address"?: number;
}

export async function runPvmTest(testContent: PvmTest) {
  const initialMemory = testContent["initial-memory"];
  const pageMap = testContent["initial-page-map"];
  const memoryBuilder = new MemoryBuilder();

  for (const page of pageMap) {
    const startPageIndex = tryAsMemoryIndex(page.address);
    const endPageIndex = tryAsMemoryIndex(startPageIndex + page.length);
    const isWriteable = page["is-writable"];

    if (isWriteable) {
      memoryBuilder.setWriteablePages(startPageIndex, endPageIndex, safeAllocUint8Array(page.length));
    } else {
      memoryBuilder.setReadablePages(startPageIndex, endPageIndex, safeAllocUint8Array(page.length));
    }
  }

  for (const memoryChunk of initialMemory) {
    const address = tryAsMemoryIndex(memoryChunk.address);
    memoryBuilder.setData(address, memoryChunk.contents);
  }
  const maxAddressFromPageMap = Math.max(...pageMap.map((page) => page.address + page.length));
  const hasMemoryLayout = maxAddressFromPageMap >= 0;
  const HEAP_START_PAGE = hasMemoryLayout ? maxAddressFromPageMap + PAGE_SIZE : 0;
  const HEAP_END_PAGE = MAX_MEMORY_INDEX;
  const memory = memoryBuilder.finalize(tryAsMemoryIndex(HEAP_START_PAGE), tryAsSbrkIndex(HEAP_END_PAGE));
  const regs = Registers.empty();
  regs.copyFrom(testContent["initial-regs"]);

  const pvm = Interpreter.new();

  const mapPvmStatus = (status: Status) => {
    if (status === Status.FAULT) {
      return "page-fault";
    }

    if (status === Status.PANIC) {
      return "panic";
    }

    if (status === Status.OOG) {
      return "oog";
    }

    if (status === Status.HOST) {
      return "host";
    }

    return "halt";
  };

```
