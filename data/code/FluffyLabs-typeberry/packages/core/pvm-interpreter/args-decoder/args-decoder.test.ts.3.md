---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L363-L486
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 3
chunk_total: 11
content_sha: 6aa9a63a25f4615f56286bdc2cb8a954c959b4d38ee8d8eba2cb93ac9cf9acce
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 363–486)

```typescript
      type: argumentType,
      registerIndex: 7,
      immediateDecoder: expectedImmediateDecoder,
      nextPc: 6,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg, 1 immediate and 1 offset (no args, last instruction)", () => {
    const programBytes = [Instruction.BRANCH_EQ_IMM];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET,
    });
    const expectedImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,
      registerIndex: 0,
      immediateDecoder: expectedImmediateDecoder,
      nextPc: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg, 1 immediate and 1 offset (2 instructions)", () => {
    const programBytes = [Instruction.BRANCH_EQ_IMM, 39, 210, 4, 6, Instruction.BRANCH_EQ_IMM, 39, 210, 4, 6];
    const maskBytes = [0b0010_0001, 0b0000_0000];
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

  it("should return correct result for instruction with 1 reg, 1 immediate and 1 offset (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.BRANCH_EQ_IMM, Instruction.BRANCH_EQ_IMM, 39, 210, 4, 6];
    const maskBytes = [0b0000_0011, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET,
    });
    const expectedImmediateDecoder = prepareImmediate([39, 210, 4, 6]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,
      registerIndex: 1,
      immediateDecoder: expectedImmediateDecoder,
      nextPc: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 offset", () => {
    const programBytes = [Instruction.BRANCH_EQ, 135, 4];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_OFFSET,
    });
    const expectedResult = {
      noOfBytesToSkip: 3,
      type: argumentType,

      firstRegisterIndex: 7,
      secondRegisterIndex: 8,

      nextPc: 4,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 offset (no args, last instruction)", () => {
    const programBytes = [Instruction.BRANCH_EQ];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_OFFSET,
    });
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 0,
      secondRegisterIndex: 0,

      nextPc: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 offset (2 instructions)", () => {
```
