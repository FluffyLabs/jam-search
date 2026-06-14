---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.test.ts#L1-L89
title: packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 8ccc93003f2ad2c39e39408eb43f215705a598cb20d5d71e74b95f6158c4d2ac
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.test.ts` (lines 1–89)

```typescript
import assert from "node:assert";
import { test } from "node:test";
import type { ThreeRegistersArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { Instruction } from "../instruction.js";
import { BitOps, BitRotationOps, BooleanOps, MathOps, MoveOps, ShiftOps } from "../ops/index.js";
import { Registers } from "../registers.js";
import { ThreeRegsDispatcher } from "./three-regs-dispatcher.js";

test("ThreeRegsDispatcher", async (t) => {
  const regs = Registers.empty();
  const mathOps = MathOps.new(regs);
  const bitOps = BitOps.new(regs);
  const shiftOps = ShiftOps.new(regs);
  const booleanOps = BooleanOps.new(regs);
  const moveOps = MoveOps.new(regs);
  const bitRotationOps = BitRotationOps.new(regs);

  const mockFn = t.mock.fn();

  function mockAllMethods(obj: object) {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

    for (const method of methodNames) {
      t.mock.method(obj, method, mockFn);
    }
  }

  t.before(() => {
    mockAllMethods(bitOps);
    mockAllMethods(booleanOps);
    mockAllMethods(moveOps);
    mockAllMethods(mathOps);
    mockAllMethods(bitOps);
    mockAllMethods(shiftOps);
    mockAllMethods(bitRotationOps);
  });

  t.after(() => {
    t.mock.restoreAll();
  });

  t.beforeEach(() => {
    mockFn.mock.resetCalls();
  });

  const threeRegsInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] === ArgumentType.THREE_REGISTERS);

  for (const [name, instruction] of threeRegsInstructions) {
    await t.test(`checks if instruction ${name} = ${instruction} is handled by ThreeRegsDispatcher`, () => {
      const threeRegsDispatcher = new ThreeRegsDispatcher(
        mathOps,
        shiftOps,
        bitOps,
        booleanOps,
        moveOps,
        bitRotationOps,
      );

      threeRegsDispatcher.dispatch(instruction, {} as ThreeRegistersArgs);

      assert.strictEqual(mockFn.mock.calls.length, 1);
    });
  }

  const otherInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.THREE_REGISTERS);

  for (const [name, instruction] of otherInstructions) {
    await t.test(`checks if instruction ${name} = ${instruction} is not handled by ThreeRegsDispatcher`, () => {
      const threeRegsDispatcher = new ThreeRegsDispatcher(
        mathOps,
        shiftOps,
        bitOps,
        booleanOps,
        moveOps,
        bitRotationOps,
      );

      threeRegsDispatcher.dispatch(instruction, {} as ThreeRegistersArgs);

      assert.strictEqual(mockFn.mock.calls.length, 0);
    });
  }
});
```
