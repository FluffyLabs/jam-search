---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L747-L862
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 6
chunk_total: 11
content_sha: 816b1a620b783411a56492f0e577f6b4d9cea53aa08f52c032a4cb92c2bd68e2
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 747–862)

```typescript
    const programBytes = [Instruction.LOAD_IMM, 0x02, 0xff, Instruction.LOAD_IMM, 0x02, 0xff];
    const maskBytes = [0b0000_1001];
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

  it("should return correct result for instruction with 1 reg and 1 immediate (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.LOAD_IMM, Instruction.LOAD_IMM, 0x02, 0xff];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      registerIndex: 3,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 immediates", () => {
    const programBytes = [Instruction.STORE_IMM_U8, 1, 1, 2];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x01]);
    const expectedSecondImmediateDecoder = prepareImmediate([0x02]);
    const expectedResult = {
      noOfBytesToSkip: 4,
      type: argumentType,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 immediates (no args, last instruction)", () => {
    const programBytes = [Instruction.STORE_IMM_U8];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0]);
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

  it("should return correct result for instruction with 2 immediates (2 instructions)", () => {
    const programBytes = [Instruction.STORE_IMM_U8, 1, 1, 2, Instruction.STORE_IMM_U8, 1, 1, 2];
    const maskBytes = [0b0001_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x01]);
    const expectedSecondImmediateDecoder = prepareImmediate([0x02]);
    const expectedResult = {
      noOfBytesToSkip: 4,
      type: argumentType,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 immediates (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.STORE_IMM_U8, Instruction.STORE_IMM_U8, 1, 1, 2];
```
