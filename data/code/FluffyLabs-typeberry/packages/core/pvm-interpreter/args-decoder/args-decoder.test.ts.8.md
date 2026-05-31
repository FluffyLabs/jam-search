---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L973-L1093
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 8
chunk_total: 11
content_sha: 0df20f32823434f3095b33d669a896446fd4bcd6e0c035f16b46f6dd062358c3
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 973–1093)

```typescript
    const programBytes = [Instruction.STORE_IMM_IND_U8, Instruction.STORE_IMM_IND_U8, 0x27, 1, 2, 3, 4];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x27, 1, 2, 3]);
    const expectedSecondImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      registerIndex: 6,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 2 immediates", () => {
    const programBytes = [Instruction.LOAD_IMM_JUMP_IND, 135, 2, 1, 2, 3, 4];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x01, 0x02]);
    const expectedSecondImmediateDecoder = prepareImmediate([0x03, 0x04]);
    const expectedResult = {
      noOfBytesToSkip: 7,
      type: argumentType,

      firstRegisterIndex: 7,
      secondRegisterIndex: 8,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 2 immediates (no args, last instruction)", () => {
    const programBytes = [Instruction.LOAD_IMM_JUMP_IND];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0]);
    const expectedSecondImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 0,
      secondRegisterIndex: 0,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 2 immediates (2 instructions)", () => {
    const programBytes = [
      Instruction.LOAD_IMM_JUMP_IND,
      135,
      2,
      1,
      2,
      3,
      4,
      Instruction.LOAD_IMM_JUMP_IND,
      135,
      2,
      1,
      2,
      3,
      4,
    ];
    const maskBytes = [0b1000_0001, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([0x01, 0x02]);
    const expectedSecondImmediateDecoder = prepareImmediate([0x03, 0x04]);
    const expectedResult = {
      noOfBytesToSkip: 7,
      type: argumentType,

      firstRegisterIndex: 7,
      secondRegisterIndex: 8,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 2 regs and 2 immediates (2 instructions, no args, no last instruction)", () => {
    const programBytes = [Instruction.LOAD_IMM_JUMP_IND, Instruction.LOAD_IMM_JUMP_IND, 135, 2, 1, 2, 3, 4];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
```
