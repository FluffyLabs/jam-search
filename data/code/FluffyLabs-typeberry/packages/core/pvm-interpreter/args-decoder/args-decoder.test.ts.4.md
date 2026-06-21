---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L481-L619
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 4
chunk_total: 11
content_sha: 45501bda606714437c884a4d610602de49a4ed3207a90e6294d70de21fd41569
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 481–619)

```typescript
    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 offset (2 instructions)", () => {
    const programBytes = [Instruction.BRANCH_EQ, 135, 4, Instruction.BRANCH_EQ, 135, 4];
    const maskBytes = [0b0000_1001];
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

  it("should return correct result for instruction with 2 regs and 1 offset (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.BRANCH_EQ, Instruction.BRANCH_EQ, 135, 4];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_ONE_OFFSET,
    });

    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 10,
      secondRegisterIndex: 10,

      nextPc: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs", () => {
    const programBytes = [Instruction.MOVE_REG, 0x12];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS,
    });
    const expectedResult = {
      noOfBytesToSkip: 2,
      type: argumentType,

      firstRegisterIndex: 1,
      secondRegisterIndex: 2,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs (no args, last instruction)", () => {
    const programBytes = [Instruction.MOVE_REG];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS,
    });
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 0,
      secondRegisterIndex: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs (2 instructions)", () => {
    const programBytes = [Instruction.MOVE_REG, 0x12, Instruction.MOVE_REG, 0x12];
    const maskBytes = [0b0000_0101];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS,
    });
    const expectedResult = {
      noOfBytesToSkip: 2,
      type: argumentType,

      firstRegisterIndex: 1,
      secondRegisterIndex: 2,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.MOVE_REG, Instruction.MOVE_REG, 0x12];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS,
    });
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 6,
      secondRegisterIndex: 4,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 offset", () => {
    const programBytes = [Instruction.JUMP, 4];
```
