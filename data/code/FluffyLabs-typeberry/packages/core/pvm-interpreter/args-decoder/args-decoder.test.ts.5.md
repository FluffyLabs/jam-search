---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L613-L750
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 5
chunk_total: 11
content_sha: 7a2c0c431b259afe39ebcc4225e7544ad5855558a2e2751b13e481cf73b91621
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 613–750)

```typescript
    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 offset", () => {
    const programBytes = [Instruction.JUMP, 4];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_OFFSET,
    });

    const expectedResult = {
      noOfBytesToSkip: 2,
      type: argumentType,

      nextPc: 4,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 offset (no args, last instruction)", () => {
    const programBytes = [Instruction.JUMP];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_OFFSET,
    });

    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      nextPc: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 offset (2 instructions)", () => {
    const programBytes = [Instruction.JUMP, 4, Instruction.JUMP, 4];
    const maskBytes = [0b0000_0101];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_OFFSET,
    });
    const expectedResult = {
      noOfBytesToSkip: 2,
      type: argumentType,

      nextPc: 4,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 offset (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.JUMP, Instruction.JUMP, 4];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_OFFSET,
    });
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      nextPc: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 immediate", () => {
    const programBytes = [Instruction.LOAD_IMM, 0x02, 0xff];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareImmediate([0xff]);
    const expectedResult = {
      noOfBytesToSkip: 3,
      type: argumentType,

      registerIndex: 2,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 immediate (no args, last instruction)", () => {
    const programBytes = [Instruction.LOAD_IMM];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      registerIndex: 0,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 immediate (2 instructions)", () => {
    const programBytes = [Instruction.LOAD_IMM, 0x02, 0xff, Instruction.LOAD_IMM, 0x02, 0xff];
    const maskBytes = [0b0000_1001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
```
