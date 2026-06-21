---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L1-L122
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 11
content_sha: 449e02ca5fc49e51796599fef306a46e0be2695c603fb573192f4b627cb4a76b
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 1–122)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { BitVec } from "@typeberry/bytes";
import { Instruction } from "../instruction.js";
import { Mask } from "../program-decoder/mask.js";
import { ArgsDecoder } from "./args-decoder.js";
import { createResults } from "./args-decoding-results.js";
import { ArgumentType } from "./argument-type.js";
import { ExtendedWitdthImmediateDecoder } from "./decoders/extended-with-immediate-decoder.js";
import { ImmediateDecoder } from "./decoders/immediate-decoder.js";

describe("ArgsDecoder", () => {
  function prepareData({
    programBytes,
    maskBytes,
    argumentType,
  }: {
    programBytes: number[];
    maskBytes: number[];
    argumentType: ArgumentType;
  }) {
    const code = new Uint8Array(programBytes);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array(maskBytes), programBytes.length));
    const argsDecoder = new ArgsDecoder();
    argsDecoder.reset(code, mask);
    const result = createResults()[argumentType];

    return { argsDecoder, result, argumentType };
  }

  function prepareImmediate(bytes: number[]) {
    const immediate = ImmediateDecoder.new();
    immediate.setBytes(new Uint8Array(bytes));
    return immediate;
  }

  function prepareExtendedWidthImmediate(bytes: number[]) {
    const immediate = ExtendedWitdthImmediateDecoder.new();
    immediate.setBytes(new Uint8Array(bytes));
    return immediate;
  }

  it("should return empty result for instruction without args", () => {
    const programBytes = [Instruction.TRAP];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.NO_ARGUMENTS,
    });
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return empty result for instruction without args (2 instructions)", () => {
    const programBytes = [Instruction.TRAP, Instruction.TRAP];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.NO_ARGUMENTS,
    });

    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 immediate", () => {
    const programBytes = [Instruction.ECALLI, 0xff];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareImmediate([0xff]);
    const expectedResult = {
      noOfBytesToSkip: 2,
      type: argumentType,
      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 immediate (no args, last instruction)", () => {
    const programBytes = [Instruction.ECALLI];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,
      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 immediate (2 instructions)", () => {
    const programBytes = [Instruction.ECALLI, 0xff, Instruction.ECALLI, 0xff];
    const maskBytes = [0b0000_0101];
```
