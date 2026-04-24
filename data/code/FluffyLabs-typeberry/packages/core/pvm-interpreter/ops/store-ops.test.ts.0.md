---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/store-ops.test.ts#L1-L94
title: packages/core/pvm-interpreter/ops/store-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 4
content_sha: f643bde3b94eceb8ce8788c6d2cbb325a0fd992f96e060c8f8ce23873f1aaf7a
language: typescript
---
`packages/core/pvm-interpreter/ops/store-ops.test.ts` (lines 1–94)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { InstructionResult } from "../instruction-result.js";
import { MemoryBuilder } from "../memory/index.js";
import { PAGE_SIZE, RESERVED_NUMBER_OF_PAGES } from "../memory/memory-consts.js";
import { type MemoryIndex, tryAsMemoryIndex, tryAsSbrkIndex } from "../memory/memory-index.js";
import { getPageNumber, getStartPageIndex } from "../memory/memory-utils.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { StoreOps } from "./store-ops.js";

const getExpectedPage = (address: MemoryIndex, contents: Uint8Array, length: number) => {
  const pageStartIndex = getStartPageIndex(address);
  const prefix = new Uint8Array(address - pageStartIndex);
  const suffix = new Uint8Array(length - prefix.length - contents.length);
  prefix.fill(0x1);
  suffix.fill(0x1);
  const rawPage = [...prefix, ...contents];
  return new Uint8Array([...rawPage, ...suffix]);
};

describe("StoreOps", () => {
  function prepareStoreData(valueToStore: bigint, noOfBytes: 1 | 2 | 4 | 8) {
    const instructionResult = new InstructionResult();
    const regs = Registers.empty();
    const address = tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + 1);
    const registerIndex = 1;
    regs.setU64(registerIndex, valueToStore);
    const initialMemory = new Uint8Array(32);
    initialMemory.fill(0x1);
    const memory = new MemoryBuilder()
      .setWriteablePages(
        getStartPageIndex(address),
        tryAsMemoryIndex(getStartPageIndex(address) + PAGE_SIZE),
        initialMemory,
      )
      .finalize(tryAsMemoryIndex(20 * PAGE_SIZE), tryAsSbrkIndex(30 * PAGE_SIZE));
    const storeOps = StoreOps.new(regs, memory, instructionResult);
    const expectedPage = getExpectedPage(address, bigintToUint8ArrayLE(valueToStore, noOfBytes), 32);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(valueToStore, noOfBytes));

    return { storeOps, address, registerIndex, memory, expectedPage, immediate };
  }
  describe("store (U8, U16 U32 and U64)", () => {
    it("should store u8 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, registerIndex, address, memory, expectedPage } = prepareStoreData(valueToStore, 1);

      storeOps.storeU8(address, registerIndex);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u16 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, registerIndex, address, memory, expectedPage } = prepareStoreData(valueToStore, 2);

      storeOps.storeU16(address, registerIndex);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u32 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, registerIndex, address, memory, expectedPage } = prepareStoreData(valueToStore, 4);

      storeOps.storeU32(address, registerIndex);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u64 number", () => {
      const valueToStore = 0xfe_dc_ba_98_76_54_32_10n;
      const { storeOps, registerIndex, address, memory, expectedPage } = prepareStoreData(valueToStore, 8);

      storeOps.storeU64(address, registerIndex);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });
  });

  describe("storeImmediate (U8, U16 U32 and U64)", () => {
    it("should store u8 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, immediate, address, memory, expectedPage } = prepareStoreData(valueToStore, 1);

```
