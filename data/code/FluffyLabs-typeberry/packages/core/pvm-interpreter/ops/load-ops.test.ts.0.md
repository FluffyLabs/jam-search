---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/load-ops.test.ts#L1-L93
title: packages/core/pvm-interpreter/ops/load-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 16ff1855ac2f1da1d0df0829f0c3f8522d0dcc40e236761864882a6ba88bbcc7
language: typescript
---
`packages/core/pvm-interpreter/ops/load-ops.test.ts` (lines 1–93)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { InstructionResult } from "../instruction-result.js";
import { Memory, MemoryBuilder } from "../memory/index.js";
import { PAGE_SIZE, RESERVED_NUMBER_OF_PAGES } from "../memory/memory-consts.js";
import { type MemoryIndex, tryAsMemoryIndex, tryAsSbrkIndex } from "../memory/memory-index.js";
import { getStartPageIndex } from "../memory/memory-utils.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { LoadOps } from "./load-ops.js";

describe("LoadOps", () => {
  describe("loadImmediate", () => {
    function prepareLoadImmediateData(numberToLoad: bigint) {
      const instructionResult = new InstructionResult();
      const registers = Registers.empty();
      const memory = Memory.new();
      const loadOps = LoadOps.new(registers, memory, instructionResult);
      const immediateDecoder = ImmediateDecoder.new();
      immediateDecoder.setBytes(bigintToUint8ArrayLE(numberToLoad));

      return {
        registers,
        loadOps,
        immediateDecoder,
        resultRegister: 12,
      };
    }

    it("should load positive number into register", () => {
      const numberToLoad = 15n;
      const { resultRegister, loadOps, registers, immediateDecoder } = prepareLoadImmediateData(numberToLoad);

      loadOps.loadImmediate(resultRegister, immediateDecoder);

      assert.strictEqual(registers.getI64(resultRegister), numberToLoad);
      assert.strictEqual(registers.getU64(resultRegister), numberToLoad);
    });

    it("should load negative number into register", () => {
      const numberToLoad = -1n;
      const { resultRegister, loadOps, registers, immediateDecoder } = prepareLoadImmediateData(numberToLoad);
      const expectedUnsignedNumber = 2n ** 64n - 1n;

      loadOps.loadImmediate(resultRegister, immediateDecoder);

      assert.strictEqual(registers.getI64(resultRegister), numberToLoad);
      assert.strictEqual(registers.getU64(resultRegister), expectedUnsignedNumber);
    });
  });

  function prepareLoadData(address: MemoryIndex, data: Uint8Array) {
    const instructionResult = new InstructionResult();

    const memory = new MemoryBuilder()
      .setWriteablePages(getStartPageIndex(address), tryAsMemoryIndex(getStartPageIndex(address) + PAGE_SIZE), data)
      .finalize(tryAsMemoryIndex(20 * PAGE_SIZE), tryAsSbrkIndex(30 * PAGE_SIZE));
    const registers = Registers.empty();
    const loadOps = LoadOps.new(registers, memory, instructionResult);
    const registerIndex = 0;
    registers.setU64(registerIndex, 0x11_22_33_44_55_66_77_88n);

    return {
      loadOps,
      registers,
      registerIndex,
    };
  }

  describe("load (U8, U16, U32 and U64)", () => {
    it("should load u8 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xff, 0xee, 0xdd, 0xcc]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedValue = 0xffn;

      loadOps.loadU8(address, registerIndex);

      assert.deepStrictEqual(registers.getI64(registerIndex), expectedValue);
      assert.deepStrictEqual(registers.getU64(registerIndex), expectedValue);
    });

    it("should load u16 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xff, 0xee, 0xdd, 0xcc]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedValue = 61183n;

      loadOps.loadU16(address, registerIndex);

      assert.deepStrictEqual(registers.getI64(registerIndex), expectedValue);
```
