---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-offset-dispatcher.test.ts#L1-L70
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-offset-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ddc90cb1d9872c669321ecc4b25a9cc27fd622b444d3676146d3c1c8220d721a
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-offset-dispatcher.test.ts` (lines 1–70)

```typescript
import assert from "node:assert";
import { test } from "node:test";
import type { TwoRegistersOneOffsetArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { BasicBlocks } from "../basic-blocks/index.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { BranchOps } from "../ops/index.js";
import { Registers } from "../registers.js";
import { TwoRegsOneOffsetDispatcher } from "./two-regs-one-offset-dispatcher.js";

test("TwoRegsOneOffsetDispatcher", async (t) => {
  const regs = Registers.empty();
  const instructionResult = new InstructionResult();
  const basicBlocks = new BasicBlocks();
  const branchOps = BranchOps.new(regs, instructionResult, basicBlocks);

  const mockFn = t.mock.fn();

  function mockAllMethods(obj: object) {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

    for (const method of methodNames) {
      t.mock.method(obj, method, mockFn);
    }
  }

  t.before(() => {
    mockAllMethods(branchOps);
  });

  t.after(() => {
    t.mock.restoreAll();
  });

  t.beforeEach(() => {
    mockFn.mock.resetCalls();
  });

  const argsMock = {} as TwoRegistersOneOffsetArgs;

  const relevantInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] === ArgumentType.TWO_REGISTERS_ONE_OFFSET);

  for (const [name, instruction] of relevantInstructions) {
    await t.test(`checks if instruction ${name} = ${instruction} is handled by TwoRegsOneOffsetDispatcher`, () => {
      const dispatcher = new TwoRegsOneOffsetDispatcher(branchOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 1);
    });
  }

  const otherInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.TWO_REGISTERS_ONE_OFFSET);

  for (const [name, instruction] of otherInstructions) {
    await t.test(`checks if instruction ${name} = ${instruction} is not handled by TwoRegsOneOffsetDispatcher`, () => {
      const dispatcher = new TwoRegsOneOffsetDispatcher(branchOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 0);
    });
  }
});
```
