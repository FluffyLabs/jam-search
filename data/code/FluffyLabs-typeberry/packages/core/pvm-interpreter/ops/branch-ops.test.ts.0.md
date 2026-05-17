---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/branch-ops.test.ts#L1-L97
title: packages/core/pvm-interpreter/ops/branch-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 9
content_sha: 3a478ce60ee2c5b8e0e7fb1c34c828de5b4171b822d5d243e36f243e2ca60d2b
language: typescript
---
`packages/core/pvm-interpreter/ops/branch-ops.test.ts` (lines 1–97)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { BitVec } from "@typeberry/bytes";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { BasicBlocks } from "../basic-blocks/index.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { Mask } from "../program-decoder/mask.js";
import { Registers } from "../registers.js";
import { Result } from "../result.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { BranchOps } from "./branch-ops.js";

describe("BranchOps", () => {
  function prepareData(firstValue: bigint, secondValue: bigint, initialNextPc: number) {
    const regs = Registers.empty();
    const instructionResult = new InstructionResult();
    const code = new Uint8Array([Instruction.ADD_32, 5, 6, Instruction.SUB_32, 5, 6]);
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_1001]), code.length)));
    instructionResult.nextPc = initialNextPc;
    const branchOps = BranchOps.new(regs, instructionResult, basicBlocks);
    const firstRegisterIndex = 0;
    const secondRegisterIndex = 1;
    regs.setU64(firstRegisterIndex, firstValue);
    regs.setU64(secondRegisterIndex, secondValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    return { regs, instructionResult, branchOps, firstRegisterIndex, secondRegisterIndex, immediate };
  }

  describe("jump", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;
      const { branchOps, instructionResult } = prepareData(0n, 0n, 1);

      branchOps.jump(nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc because nextPc is not the beginning of basic block", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult } = prepareData(0n, 0n, 0);

      branchOps.jump(nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });
  });

  describe("branchEq", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;

      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(5n, 5n, 1);

      branchOps.branchEq(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc (condition is not met)", () => {
      const nextPc = 0;
      const expectedNextPc = 1;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(5n, 6n, 1);

      branchOps.branchEq(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should update status to PANIC (nextPc is not the beginning of basic block)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(5n, 5n, 0);

      branchOps.branchEq(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(5n, 6n, 0);

```
