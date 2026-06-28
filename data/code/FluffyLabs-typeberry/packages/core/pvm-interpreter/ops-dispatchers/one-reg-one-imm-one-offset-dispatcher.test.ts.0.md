---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts#L1-L87
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: e1338472ea352eaa86bece783fac8a82b9d2e0d972c738ad98b0af3c039ddbe4
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts` (lines 1–87)

```typescript
import assert from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import type { OneRegisterOneImmediateOneOffsetArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { BasicBlocks } from "../basic-blocks/index.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { Memory } from "../memory/index.js";
import { BranchOps, LoadOps } from "../ops/index.js";
import { Registers } from "../registers.js";
import { OneRegOneImmOneOffsetDispatcher } from "./one-reg-one-imm-one-offset-dispatcher.js";

describe("OneRegOneImmOneOffsetDispatcher", () => {
  describe("check if it handles expected instructions", () => {
    const regs = Registers.empty();
    const memory = Memory.new();
    const instructionResult = new InstructionResult();
    const basicBlocks = new BasicBlocks();
    const branchOps = BranchOps.new(regs, instructionResult, basicBlocks);
    const loadOps = LoadOps.new(regs, memory, instructionResult);

    after(() => {
      mock.restoreAll();
    });

    const argsMock = {
      immediateDecoder: ImmediateDecoder.new(),
    } as OneRegisterOneImmediateOneOffsetArgs;

    it("it should call BranchOps.jump and LoadOps.loadImmediate", () => {
      const jumpMockFunction = mock.fn();
      const loadImmMockFunction = mock.fn();
      mock.method(branchOps, "jump", jumpMockFunction);
      mock.method(loadOps, "loadImmediate", loadImmMockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.LOAD_IMM_JUMP, argsMock);

      assert.strictEqual(jumpMockFunction.mock.calls.length, 1);
      assert.strictEqual(loadImmMockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchEqImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchEqImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_EQ_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchNeImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchNeImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_NE_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchLtUnsignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchLtUnsignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_LT_U_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchLeUnsignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchLeUnsignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_LE_U_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchGeUnsignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchGeUnsignedImmediate", mockFunction);
```
