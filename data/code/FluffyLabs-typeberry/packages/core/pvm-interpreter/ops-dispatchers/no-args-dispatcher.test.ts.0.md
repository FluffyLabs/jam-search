---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/no-args-dispatcher.test.ts#L1-L63
title: packages/core/pvm-interpreter/ops-dispatchers/no-args-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4964b13f6b86f161abef5e374d97dbe24335fa66d8ea424575d42a38b92450c5
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/no-args-dispatcher.test.ts` (lines 1–63)

```typescript
import assert from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { NoArgsOps } from "../ops/index.js";
import { NoArgsDispatcher } from "./no-args-dispatcher.js";

describe("NoArgsDispatcher", () => {
  const instructionResult = new InstructionResult();
  const noArgsOps = NoArgsOps.new(instructionResult);

  const mockFn = mock.fn();

  function mockAllMethods(obj: object) {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

    for (const method of methodNames) {
      mock.method(obj, method, mockFn);
    }
  }

  before(() => {
    mockAllMethods(noArgsOps);
  });

  after(() => {
    mock.restoreAll();
  });

  beforeEach(() => {
    mockFn.mock.resetCalls();
  });

  const relevantInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] === ArgumentType.NO_ARGUMENTS);

  for (const [name, instruction] of relevantInstructions) {
    it(`checks if instruction ${name} = ${instruction} is handled by OneRegTwoImmsDispatcher`, () => {
      const dispatcher = new NoArgsDispatcher(noArgsOps);

      dispatcher.dispatch(instruction);

      assert.strictEqual(mockFn.mock.calls.length, 1);
    });
  }

  const otherInstructions = Object.entries(Instruction)
    .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
    .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.NO_ARGUMENTS);

  for (const [name, instruction] of otherInstructions) {
    it(`checks if instruction ${name} = ${instruction} is not handled by OneRegTwoImmsDispatcher`, () => {
      const dispatcher = new NoArgsDispatcher(noArgsOps);

      dispatcher.dispatch(instruction);

      assert.strictEqual(mockFn.mock.calls.length, 0);
    });
  }
});
```
