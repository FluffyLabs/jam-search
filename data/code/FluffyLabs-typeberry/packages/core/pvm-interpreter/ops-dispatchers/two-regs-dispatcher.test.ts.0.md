---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-dispatcher.test.ts#L1-L75
title: packages/core/pvm-interpreter/ops-dispatchers/two-regs-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: d29d0c16bf1c0db6a2c4ef9417f9d3aa4971843500a34cbeb1186403bbd00228
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-dispatcher.test.ts` (lines 1–75)

```typescript
import assert from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import type { TwoRegistersArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { Memory } from "../memory/index.js";
import { BitOps, BitRotationOps, MemoryOps, MoveOps } from "../ops/index.js";
import { Registers } from "../registers.js";
import { TwoRegsDispatcher } from "./two-regs-dispatcher.js";

describe("TwoRegsDispatcher", () => {
  const instructionResult = new InstructionResult();
  const regs = Registers.empty();
  const memory = Memory.new();
  const memoryOps = MemoryOps.new(regs, memory, instructionResult);
  const moveOps = MoveOps.new(regs);
  const bitOps = BitOps.new(regs);
  const bitRotationOps = BitRotationOps.new(regs);
  const mockFn = mock.fn();

  function mockAllMethods(obj: object) {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

    for (const method of methodNames) {
      mock.method(obj, method, mockFn);
    }
  }

  before(() => {
    mockAllMethods(memoryOps);
    mockAllMethods(moveOps);
    mockAllMethods(bitOps);
    mockAllMethods(bitRotationOps);
  });

  after(() => {
    mock.restoreAll();
  });

  beforeEach(() => {
    mockFn.mock.resetCalls();
  });

  const argsMock = {} as TwoRegistersArgs;

  const relevantInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] === ArgumentType.TWO_REGISTERS);

  for (const [name, instruction] of relevantInstructions) {
    it(`checks if instruction ${name} = ${instruction} is handled by OneRegTwoImmsDispatcher`, () => {
      const dispatcher = new TwoRegsDispatcher(moveOps, memoryOps, bitOps, bitRotationOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 1);
    });
  }

  const otherInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.TWO_REGISTERS);

  for (const [name, instruction] of otherInstructions) {
    it(`checks if instruction ${name} = ${instruction} is not handled by TwoRegsDispatcher`, () => {
      const dispatcher = new TwoRegsDispatcher(moveOps, memoryOps, bitOps, bitRotationOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 0);
    });
  }
});
```
