---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/dynamic-jump-ops.test.ts#L1-L93
title: packages/core/pvm-interpreter/ops/dynamic-jump-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 4d5313f80a08c5ecbe3a725065d9822154030e50699c2a45f7863a796889b9c0
language: typescript
---
`packages/core/pvm-interpreter/ops/dynamic-jump-ops.test.ts` (lines 1–93)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { BitVec } from "@typeberry/bytes";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { BasicBlocks } from "../basic-blocks/index.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { JumpTable } from "../program-decoder/jump-table.js";
import { Mask } from "../program-decoder/mask.js";
import { Registers } from "../registers.js";
import { Result } from "../result.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { DynamicJumpOps } from "./dynamic-jump-ops.js";

describe("DynamicJumpOps", () => {
  function prepareData(firstValue: bigint, secondValue: bigint) {
    const regs = Registers.empty();
    const jumpTable = JumpTable.fromRaw(1, new Uint8Array([0, 3]));
    const instructionResult = new InstructionResult();
    const code = new Uint8Array([Instruction.TRAP, Instruction.TRAP, Instruction.TRAP, Instruction.ADD_32, 5, 6]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_1111]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const dynamicJumpOps = DynamicJumpOps.new(regs, jumpTable, instructionResult, basicBlocks);
    const registerIndex = 0;
    regs.setU64(registerIndex, firstValue);
    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    return {
      dynamicJumpOps,
      instructionResult,
      registerIndex,
      immediate,
    };
  }

  it("should set correct nextPc", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(3n, 1n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.nextPc, 3);
    assert.strictEqual(instructionResult.status, null);
  });

  it("should set correct nextPc (address overflow)", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(2n ** 32n - 1n, 5n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.nextPc, 3);
    assert.strictEqual(instructionResult.status, null);
  });

  it("should change status to HALT", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(0xff_ff_00_00n, 0n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.HALT);
  });

  it("should change status to PANIC because dynamic address is equal to 0 ", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(0n, 0n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.PANIC);
  });

  it("should change status to PANIC because dynamic address does not exist in jump table", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(11n, 5n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.PANIC);
  });

  it("should change status to PANIC because dynamic address is not a multiple of jump aligment factor (that is equal to 4) ", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(4n, 5n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.PANIC);
  });

```
