---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions.ts#L114-L187
title: assembly/instructions.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 503d6cdf73ac1a8159729b3a16daa66b7d813a9d5cd37fcba536b058ae6a5105
language: typescript
---
`assembly/instructions.ts` (lines 114–187)

```typescript
  /* 081 */ instruction("BRANCH_EQ_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 082 */ instruction("BRANCH_NE_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 083 */ instruction("BRANCH_LT_U_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 084 */ instruction("BRANCH_LE_U_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 085 */ instruction("BRANCH_GE_U_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 086 */ instruction("BRANCH_GT_U_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 087 */ instruction("BRANCH_LT_S_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 088 */ instruction("BRANCH_LE_S_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 089 */ instruction("BRANCH_GE_S_IMM", Arguments.OneRegOneImmOneOff, 1, true),

  /* 090 */ instruction("BRANCH_GT_S_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 100 */ instruction("MOVE_REG", Arguments.TwoReg, 1),
  /* 101 */ SBRK,
  /* 102 */ instruction("COUNT_SET_BITS_64", Arguments.TwoReg, 1),
  /* 103 */ instruction("COUNT_SET_BITS_32", Arguments.TwoReg, 1),
  /* 104 */ instruction("LEADING_ZERO_BITS_64", Arguments.TwoReg, 1),
  /* 105 */ instruction("LEADING_ZERO_BITS_32", Arguments.TwoReg, 1),
  /* 106 */ instruction("TRAILING_ZERO_BITS_64", Arguments.TwoReg, 1),
  /* 107 */ instruction("TRAILING_ZERO_BITS_32", Arguments.TwoReg, 1),
  /* 108 */ instruction("SIGN_EXTEND_8", Arguments.TwoReg, 1),
  /* 109 */ instruction("SIGN_EXTEND_16", Arguments.TwoReg, 1),

  /* 110 */ instruction("ZERO_EXTEND_16", Arguments.TwoReg, 1),
  /* 111 */ instruction("REVERSE_BYTES", Arguments.TwoReg, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 120 */ instruction("STORE_IND_U8", Arguments.TwoRegOneImm, 1),
  /* 121 */ instruction("STORE_IND_U16", Arguments.TwoRegOneImm, 1),
  /* 122 */ instruction("STORE_IND_U32", Arguments.TwoRegOneImm, 1),
  /* 123 */ instruction("STORE_IND_U64", Arguments.TwoRegOneImm, 1),
  /* 124 */ instruction("LOAD_IND_U8", Arguments.TwoRegOneImm, 1),
  /* 125 */ instruction("LOAD_IND_I8", Arguments.TwoRegOneImm, 1),
  /* 126 */ instruction("LOAD_IND_U16", Arguments.TwoRegOneImm, 1),
  /* 127 */ instruction("LOAD_IND_I16", Arguments.TwoRegOneImm, 1),
  /* 128 */ instruction("LOAD_IND_U32", Arguments.TwoRegOneImm, 1),
  /* 129 */ instruction("LOAD_IND_I32", Arguments.TwoRegOneImm, 1),

  /* 130 */ instruction("LOAD_IND_U64", Arguments.TwoRegOneImm, 1),
  /* 131 */ instruction("ADD_IMM_32", Arguments.TwoRegOneImm, 1),
  /* 132 */ instruction("AND_IMM", Arguments.TwoRegOneImm, 1),
  /* 133 */ instruction("XOR_IMM", Arguments.TwoRegOneImm, 1),
  /* 134 */ instruction("OR_IMM", Arguments.TwoRegOneImm, 1),
  /* 135 */ instruction("MUL_IMM_32", Arguments.TwoRegOneImm, 1),
  /* 136 */ instruction("SET_LT_U_IMM", Arguments.TwoRegOneImm, 1),
  /* 137 */ instruction("SET_LT_S_IMM", Arguments.TwoRegOneImm, 1),
  /* 138 */ instruction("SHLO_L_IMM_32", Arguments.TwoRegOneImm, 1),
  /* 139 */ instruction("SHLO_R_IMM_32", Arguments.TwoRegOneImm, 1),

  /* 140 */ instruction("SHAR_R_IMM_32", Arguments.TwoRegOneImm, 1),
  /* 141 */ instruction("NEG_ADD_IMM_32", Arguments.TwoRegOneImm, 1),
  /* 142 */ instruction("SET_GT_U_IMM", Arguments.TwoRegOneImm, 1),
  /* 143 */ instruction("SET_GT_S_IMM", Arguments.TwoRegOneImm, 1),
  /* 144 */ instruction("SHLO_L_IMM_ALT_32", Arguments.TwoRegOneImm, 1),
  /* 145 */ instruction("SHLO_R_IMM_ALT_32", Arguments.TwoRegOneImm, 1),
  /* 146 */ instruction("SHAR_R_IMM_ALT_32", Arguments.TwoRegOneImm, 1),
  /* 147 */ instruction("CMOV_IZ_IMM", Arguments.TwoRegOneImm, 1),
  /* 148 */ instruction("CMOV_NZ_IMM", Arguments.TwoRegOneImm, 1),
```
