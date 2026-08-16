---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L244-L373
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 11
content_sha: e5406f24dd8dc6890e211f19e8e2527097af68d70515001172fd174b6d44de62
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 244–373)

```typescript
      thirdRegisterIndex: 2,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 immediate", () => {
    const programBytes = [Instruction.ADD_IMM_32, 0x12, 0xff];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE,
    });

    const expectedImmediateDecoder = prepareImmediate([0xff]);
    const expectedResult = {
      noOfBytesToSkip: 3,
      type: argumentType,

      firstRegisterIndex: 2,
      secondRegisterIndex: 1,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 immediate (no args, last instrction)", () => {
    const programBytes = [Instruction.ADD_IMM_32];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE,
    });

    const expectedImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 0,
      secondRegisterIndex: 0,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 immediate (2 instructions)", () => {
    const programBytes = [Instruction.ADD_IMM_32, 0x12, 0xff, Instruction.ADD_IMM_32, 0x12, 0xff];
    const maskBytes = [0b0000_1001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE,
    });

    const expectedImmediateDecoder = prepareImmediate([0xff]);
    const expectedResult = {
      noOfBytesToSkip: 3,
      type: argumentType,

      firstRegisterIndex: 2,
      secondRegisterIndex: 1,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 immediate (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.ADD_IMM_32, Instruction.ADD_IMM_32, 0x12, 0xff];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE,
    });

    const expectedImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 3,
      secondRegisterIndex: 8,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg, 1 immediate and 1 offset", () => {
    const programBytes = [Instruction.BRANCH_EQ_IMM, 39, 210, 4, 6];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET,
    });
    const expectedImmediateDecoder = prepareImmediate([210, 4]);
    const expectedResult = {
      noOfBytesToSkip: 5,
      type: argumentType,
      registerIndex: 7,
      immediateDecoder: expectedImmediateDecoder,
      nextPc: 6,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

```
