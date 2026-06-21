---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-imm-dispatcher.test.ts#L1-L86
title: packages/core/pvm-interpreter/ops-dispatchers/one-imm-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 744a26ce116fef168299ecbface9927454a043790e52ab8bbee73c3e6f06f42c
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-imm-dispatcher.test.ts` (lines 1–86)

```typescript
import assert from "node:assert";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import type { OneImmediateArgs } from "../args-decoder/args-decoder.js";
import { ArgumentType } from "../args-decoder/argument-type.js";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { instructionArgumentTypeMap } from "../args-decoder/instruction-argument-type-map.js";
import { Instruction } from "../instruction.js";
import { InstructionResult } from "../instruction-result.js";
import { HostCallOps } from "../ops/index.js";
import { OneImmDispatcher } from "./one-imm-dispatcher.js";

describe("OneImmDispatcher", () => {
  describe("check if it handles expected instructions", () => {
    const instructionResult = new InstructionResult();
    const hostCallOps = HostCallOps.new(instructionResult);
    const hostCallMock = mock.fn();

    after(() => {
      mock.restoreAll();
    });

    beforeEach(() => {
      hostCallMock.mock.resetCalls();
    });

    before(() => {
      mock.method(hostCallOps, "hostCall", hostCallMock);
    });

    const argsMock = {
      immediateDecoder: ImmediateDecoder.new(),
    } as OneImmediateArgs;

    it("should call HostCallOps.hostCall", () => {
      const dispatcher = new OneImmDispatcher(hostCallOps);

      dispatcher.dispatch(Instruction.ECALLI, argsMock);

      assert.strictEqual(hostCallMock.mock.calls.length, 1);
    });
  });

  describe("check if it handles other instructions than expected", () => {
    const instructionResult = new InstructionResult();
    const hostCallOps = HostCallOps.new(instructionResult);
    const mockFn = mock.fn();

    function mockAllMethods(obj: object) {
      const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

      for (const method of methodNames) {
        mock.method(obj, method, mockFn);
      }
    }

    before(() => {
      mockAllMethods(hostCallOps);
    });

    after(() => {
      mock.restoreAll();
    });

    beforeEach(() => {
      mockFn.mock.resetCalls();
    });

    const argsMock = {
      immediateDecoder: ImmediateDecoder.new(),
    } as OneImmediateArgs;

    const otherInstructions = Object.entries(Instruction)
      .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
      .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.ONE_IMMEDIATE);

    for (const [name, instruction] of otherInstructions) {
      it(`checks if instruction ${name} = ${instruction} is not handled by OneImmDispatcher`, () => {
        const dispatcher = new OneImmDispatcher(hostCallOps);

        dispatcher.dispatch(instruction, argsMock);

        assert.strictEqual(mockFn.mock.calls.length, 0);
      });
    }
  });
});
```
