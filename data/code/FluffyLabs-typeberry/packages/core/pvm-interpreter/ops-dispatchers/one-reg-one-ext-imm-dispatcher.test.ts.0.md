---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-ext-imm-dispatcher.test.ts#L1-L72
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-ext-imm-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 43eb4e309b4c149b58c3824352475fd814ba16ce51ff8e50a49dce4157f29de5
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-ext-imm-dispatcher.test.ts` (lines 1–72)

```typescript
import assert from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import type { OneRegisterOneExtendedWidthImmediateArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { ExtendedWitdthImmediateDecoder } from "../args-decoder/decoders/extended-with-immediate-decoder.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { Memory } from "../memory/index.js";
import { LoadOps } from "../ops/index.js";
import { Registers } from "../registers.js";
import { OneRegOneExtImmDispatcher } from "./one-reg-one-ext-imm-dispatcher.js";

describe("OneRegOneExtImmDispatcher", () => {
  const regs = Registers.empty();
  const memory = Memory.new();
  const instructionResult = new InstructionResult();
  const loadOps = LoadOps.new(regs, memory, instructionResult);
  const mockFn = mock.fn();

  function mockAllMethods(obj: object) {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

    for (const method of methodNames) {
      mock.method(obj, method, mockFn);
    }
  }

  before(() => {
    mockAllMethods(loadOps);
  });

  after(() => {
    mock.restoreAll();
  });

  beforeEach(() => {
    mockFn.mock.resetCalls();
  });

  const argsMock = {
    immediateDecoder: ExtendedWitdthImmediateDecoder.new(),
  } as OneRegisterOneExtendedWidthImmediateArgs;

  const relevantInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] === ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE);

  for (const [name, instruction] of relevantInstructions) {
    it(`checks if instruction ${name} = ${instruction} is handled by TwoImmsDispatcher`, () => {
      const dispatcher = new OneRegOneExtImmDispatcher(loadOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 1);
    });
  }

  const otherInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE);

  for (const [name, instruction] of otherInstructions) {
    it(`checks if instruction ${name} = ${instruction} is not handled by TwoImmsDispatcher`, () => {
      const dispatcher = new OneRegOneExtImmDispatcher(loadOps);

      dispatcher.dispatch(instruction, argsMock);

      assert.strictEqual(mockFn.mock.calls.length, 0);
    });
  }
});
```
