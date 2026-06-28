---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L120-L252
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 11
content_sha: 69bfa52da56304091df74d0d9b4bb8e123f3977a9d96a7229aab276d47fe4928
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 120–252)

```typescript
  it("should return correct result for instruction with 1 immediate (2 instructions)", () => {
    const programBytes = [Instruction.ECALLI, 0xff, Instruction.ECALLI, 0xff];
    const maskBytes = [0b0000_0101];
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

  it("should return correct result for instruction with 1 immediate (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.ECALLI, Instruction.ECALLI, 0xff];
    const maskBytes = [0b0000_0011];
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

  it("should return correct result for instruction with 3 regs", () => {
    const programBytes = [Instruction.ADD_32, 0x12, 0x03];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.THREE_REGISTERS,
    });

    const expectedResult = {
      noOfBytesToSkip: 3,
      type: argumentType,

      firstRegisterIndex: 2,
      secondRegisterIndex: 1,
      thirdRegisterIndex: 3,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 3 regs (no args, last instruction)", () => {
    const programBytes = [Instruction.ADD_32];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.THREE_REGISTERS,
    });

    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 0,
      secondRegisterIndex: 0,
      thirdRegisterIndex: 0,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 3 regs (2 instructions)", () => {
    const programBytes = [Instruction.ADD_32, 0x12, 0x03, Instruction.ADD_32, 0x12, 0x03];
    const maskBytes = [0b0000_1001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.THREE_REGISTERS,
    });

    const expectedResult = {
      noOfBytesToSkip: 3,
      type: argumentType,

      firstRegisterIndex: 2,
      secondRegisterIndex: 1,
      thirdRegisterIndex: 3,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 3 regs (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.ADD_32, Instruction.ADD_32, 0x12, 0x03];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.THREE_REGISTERS,
    });

    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 12,
      secondRegisterIndex: 11,
      thirdRegisterIndex: 2,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 1 immediate", () => {
```
