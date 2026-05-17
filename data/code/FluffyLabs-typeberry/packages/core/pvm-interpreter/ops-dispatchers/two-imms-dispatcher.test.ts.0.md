---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-imms-dispatcher.test.ts#L1-L74
title: packages/core/pvm-interpreter/ops-dispatchers/two-imms-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 2df56847b32cb900307d5fd2cc27428b09362e6c732cc40aeea9eb313b04622d
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-imms-dispatcher.test.ts` (lines 1–74)

```typescript
import assert from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import type { TwoImmediatesArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { Memory } from "../memory/index.js";
import { StoreOps } from "../ops/index.js";
import { Registers } from "../registers.js";
import { TwoImmsDispatcher } from "./two-imms-dispatcher.js";

describe("TwoImmsDispatcher", () => {
  const regs = Registers.empty();
  const memory = Memory.new();
  const instructionResult = new InstructionResult();
  const storeOps = StoreOps.new(regs, memory, instructionResult);

  const mockFn = mock.fn();

  function mockAllMethods(obj: object) {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

    for (const method of methodNames) {
      mock.method(obj, method, mockFn);
    }
  }

  before(() => {
    mockAllMethods(storeOps);
  });

  after(() => {
    mock.restoreAll();
  });

  beforeEach(() => {
    mockFn.mock.resetCalls();
  });

  const argsMock = {
    firstImmediateDecoder: ImmediateDecoder.new(),
    secondImmediateDecoder: ImmediateDecoder.new(),
  } as TwoImmediatesArgs;

  const relevantInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] === ArgumentType.TWO_IMMEDIATES);

  for (const [name, instruction] of relevantInstructions) {
    it(`checks if instruction ${name} = ${instruction} is handled by TwoImmsDispatcher`, () => {
      const dispatcher = new TwoImmsDispatcher(storeOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 1);
    });
  }

  const otherInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.TWO_IMMEDIATES);

  for (const [name, instruction] of otherInstructions) {
    it(`checks if instruction ${name} = ${instruction} is not handled by TwoImmsDispatcher`, () => {
      const dispatcher = new TwoImmsDispatcher(storeOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 0);
    });
  }
});
```
