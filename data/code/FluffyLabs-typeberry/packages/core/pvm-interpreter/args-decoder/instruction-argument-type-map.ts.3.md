---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts#L133-L160
title: packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 4
content_sha: d8b3f2f1027a75586942ce0b432b5f1594e4a3895c3abd2256bcc8bcbfce3b30
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts` (lines 133–160)

```typescript
  instructionArgumentTypeMap[Instruction.DIV_U_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.DIV_S_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.REM_U_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.REM_S_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SET_LT_U] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SET_LT_S] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SHLO_L_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SHLO_R_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SHAR_R_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SHLO_L_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SHLO_R_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SHAR_R_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.CMOV_IZ] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.CMOV_NZ] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.ROT_L_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.ROT_L_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.ROT_R_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.ROT_R_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.AND_INV] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.OR_INV] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.XNOR] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MAX] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MAX_U] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MIN] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MIN_U] = ArgumentType.THREE_REGISTERS;

  return instructionArgumentTypeMap;
})();
```
