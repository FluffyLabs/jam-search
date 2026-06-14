---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L1091-L1223
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 9
chunk_total: 11
content_sha: 115304d679ee7dba7b82361ace0555796ba9041d4b20b3aeac164c9c9dc4e106
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 1091–1223)

```typescript
    const programBytes = [Instruction.LOAD_IMM_JUMP_IND, Instruction.LOAD_IMM_JUMP_IND, 135, 2, 1, 2, 3, 4];
    const maskBytes = [0b0000_0011];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES,
    });
    const expectedfirstImmediateDecoder = prepareImmediate([2, 1, 2, 3]);
    const expectedSecondImmediateDecoder = prepareImmediate([0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      firstRegisterIndex: 4,
      secondRegisterIndex: 11,

      firstImmediateDecoder: expectedfirstImmediateDecoder,
      secondImmediateDecoder: expectedSecondImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 extended width immediate", () => {
    const programBytes = [Instruction.LOAD_IMM_64, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09];
    const maskBytes = [0b0000_0001, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareExtendedWidthImmediate([0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09]);
    const expectedResult = {
      noOfBytesToSkip: 10,
      type: argumentType,

      registerIndex: 1,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 extended width immediate (no args, last instruction)", () => {
    const programBytes = [Instruction.LOAD_IMM_64];
    const maskBytes = [0b0000_0001];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareExtendedWidthImmediate([0x0]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      registerIndex: 0,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 extended width immediate (2 instructions)", () => {
    const programBytes = [
      Instruction.LOAD_IMM_64,
      0x01,
      0x02,
      0x03,
      0x04,
      0x05,
      0x06,
      0x07,
      0x08,
      0x09,
      Instruction.LOAD_IMM_64,
      0x01,
      0x02,
      0x03,
      0x04,
      0x05,
      0x06,
      0x07,
      0x08,
      0x09,
    ];
    const maskBytes = [0b0000_0001, 0b0000_0100, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareExtendedWidthImmediate([0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09]);
    const expectedResult = {
      noOfBytesToSkip: 10,
      type: argumentType,

      registerIndex: 1,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return correct result for instruction with 1 reg and 1 extended width immediate (2 instructions, no args, no last instruction)", () => {
    const programBytes = [
      Instruction.LOAD_IMM_64,
      Instruction.LOAD_IMM_64,
      0x01,
      0x02,
      0x03,
      0x04,
      0x05,
      0x06,
      0x07,
      0x08,
      0x09,
    ];
    const maskBytes = [0b0000_0011, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
```
