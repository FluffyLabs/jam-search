---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/assemblify.ts#L116-L221
title: packages/core/pvm-interpreter/assemblify.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: b494ce65392423b350f0eaa5403dad1ccdd806d30d2fdbbd1e40a39565d6e35d
language: typescript
---
`packages/core/pvm-interpreter/assemblify.ts` (lines 116–221)

```typescript
  [Instruction.SHLO_R_IMM_ALT_64, 1],
  [Instruction.SHAR_R_IMM_ALT_64, 1],
  [Instruction.ROT_R_64_IMM, 1],
  [Instruction.ROT_R_64_IMM_ALT, 1],
  [Instruction.ROT_R_32_IMM, 1],
  [Instruction.ROT_R_32_IMM_ALT, 1],
];

const instructionsWithTwoRegistersAndOneOffset: InstructionTuple[] = [
  [Instruction.BRANCH_EQ, 1],
  [Instruction.BRANCH_NE, 1],
  [Instruction.BRANCH_LT_U, 1],
  [Instruction.BRANCH_LT_S, 1],
  [Instruction.BRANCH_GE_U, 1],
  [Instruction.BRANCH_GE_S, 1],
];

const instructionWithTwoRegistersAndTwoImmediates: InstructionTuple[] = [[Instruction.LOAD_IMM_JUMP_IND, 1]];

const instructionsWithThreeRegisters: InstructionTuple[] = [
  [Instruction.ADD_32, 1],
  [Instruction.SUB_32, 1],
  [Instruction.MUL_32, 1],
  [Instruction.DIV_U_32, 1],
  [Instruction.DIV_S_32, 1],
  [Instruction.REM_U_32, 1],
  [Instruction.REM_S_32, 1],
  [Instruction.SHLO_L_32, 1],
  [Instruction.SHLO_R_32, 1],
  [Instruction.SHAR_R_32, 1],
  [Instruction.ADD_64, 1],
  [Instruction.SUB_64, 1],
  [Instruction.MUL_64, 1],
  [Instruction.DIV_U_64, 1],
  [Instruction.DIV_S_64, 1],
  [Instruction.REM_U_64, 1],
  [Instruction.REM_S_64, 1],
  [Instruction.SHLO_L_64, 1],
  [Instruction.SHLO_R_64, 1],
  [Instruction.SHAR_R_64, 1],
  [Instruction.AND, 1],
  [Instruction.XOR, 1],
  [Instruction.OR, 1],
  [Instruction.MUL_UPPER_S_S, 1],
  [Instruction.MUL_UPPER_U_U, 1],
  [Instruction.MUL_UPPER_S_U, 1],
  [Instruction.SET_LT_U, 1],
  [Instruction.SET_LT_S, 1],
  [Instruction.CMOV_IZ, 1],
  [Instruction.CMOV_NZ, 1],
  [Instruction.ROT_L_64, 1],
  [Instruction.ROT_L_32, 1],
  [Instruction.ROT_R_64, 1],
  [Instruction.ROT_R_32, 1],
  [Instruction.AND_INV, 1],
  [Instruction.OR_INV, 1],
  [Instruction.XNOR, 1],
  [Instruction.MAX, 1],
  [Instruction.MAX_U, 1],
  [Instruction.MIN, 1],
  [Instruction.MIN_U, 1],
];

const instructions: InstructionTuple[] = [
  ...instructionsWithoutArgs,
  ...instructionsWithOneImmediate,
  ...instructionsWithOneRegisterAndOneExtendedWidthImmediate,
  ...instructionsWithTwoImmediates,
  ...instructionsWithOneOffset,
  ...instructionsWithOneRegisterAndOneImmediate,
  ...instructionsWithOneRegisterAndTwoImmediate,
  ...instructionsWithOneRegisterOneImmediateAndOneOffset,
  ...instructionsWithTwoRegisters,
  ...instructionsWithTwoRegistersAndOneImmediate,
  ...instructionsWithTwoRegistersAndOneOffset,
  ...instructionWithTwoRegistersAndTwoImmediates,
  ...instructionsWithThreeRegisters,
];

type OpCode = {
  gas: SmallGas;
};

const createOpCodeEntry = ([byte, gas]: InstructionTuple): [Byte, OpCode] => [byte, { gas: tryAsSmallGas(gas) }];

type ByteToOpCodeMap = { [key: Byte]: OpCode };

export const byteToOpCodeMap = instructions.reduce((acc, instruction) => {
  const [byte, opCode] = createOpCodeEntry(instruction);
  acc[byte] = opCode;
  return acc;
}, {} as ByteToOpCodeMap);

export function assemblify(program: Uint8Array, mask: Mask) {
  return program.reduce(
    (acc, byte, index) => {
      if (mask.isInstruction(index)) {
        acc.push([Instruction[byte]]);
      } else {
        acc[acc.length - 1].push(byte);
      }
      return acc;
    },
    [] as Array<Array<string | number>>,
  );
}
```
