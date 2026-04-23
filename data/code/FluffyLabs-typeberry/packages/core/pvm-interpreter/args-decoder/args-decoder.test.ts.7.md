---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L861-L977
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 7
chunk_total: 11
content_sha: 41da97beda46de08eba289eeadf2d3e77f8a20be05dc2dea4bd341be6f4db093
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 861–977)

```typescript
  it("should return correct result for instruction with 2 immediates (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.STORE_IMM_U8, Instruction.STORE_IMM_U8, 1, 1, 2];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([1, 1, 2]);
    const expectedSecondImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 2 immediates", () => {
    const programBytes = [Instruction.STORE_IMM_IND_U8, 0x27, 1, 2, 3, 4];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x01, 0x02]);
    const expectedSecondImmediateDecoder = prepareImmediate([0x03, 0x04]);
    const expectedResult = {
      noOfBytesToSkip: 6,
      type: argumentType,

      registerIndex: 7,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 2 immediates (no args, last instruction)", () => {
    const programBytes = [Instruction.STORE_IMM_IND_U8];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0]);
    const expectedSecondImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      registerIndex: 0,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 2 immediates (2 instructions)", () => {
    const programBytes = [
      Instruction.STORE_IMM_IND_U8,
      0x27,
      1,
      2,
      3,
      4,
      Instruction.STORE_IMM_IND_U8,
      0x27,
      1,
      2,
      3,
      4,
    ];
    const maskBytes = [0b0100_0001, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x01, 0x02]);
    const expectedSecondImmediateDecoder = prepareImmediate([0x03, 0x04]);
    const expectedResult = {
      noOfBytesToSkip: 6,
      type: argumentType,

      registerIndex: 7,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 2 immediates (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.STORE_IMM_IND_U8, Instruction.STORE_IMM_IND_U8, 0x27, 1, 2, 3, 4];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
```
