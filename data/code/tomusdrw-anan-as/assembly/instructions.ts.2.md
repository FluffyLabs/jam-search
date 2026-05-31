---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions.ts#L185-L267
title: assembly/instructions.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 2
chunk_total: 4
content_sha: d33c53199e260f1b67755eff4e4895c4d1c9101908f8c6f8589f3ad0f25e8160
language: typescript
---
`assembly/instructions.ts` (lines 185–267)

```typescript
  /* 146 */ instruction("SHAR_R_IMM_ALT_32", Arguments.TwoRegOneImm, 1),
  /* 147 */ instruction("CMOV_IZ_IMM", Arguments.TwoRegOneImm, 1),
  /* 148 */ instruction("CMOV_NZ_IMM", Arguments.TwoRegOneImm, 1),
  /* 149 */ instruction("ADD_IMM_64", Arguments.TwoRegOneImm, 1),

  /* 150 */ instruction("MUL_IMM_64", Arguments.TwoRegOneImm, 1),
  /* 151 */ instruction("SHLO_L_IMM_64", Arguments.TwoRegOneImm, 1),
  /* 152 */ instruction("SHLO_R_IMM_64", Arguments.TwoRegOneImm, 1),
  /* 153 */ instruction("SHAR_R_IMM_64", Arguments.TwoRegOneImm, 1),
  /* 154 */ instruction("NEG_ADD_IMM_64", Arguments.TwoRegOneImm, 1),
  /* 155 */ instruction("SHLO_L_IMM_ALT_64", Arguments.TwoRegOneImm, 1),
  /* 156 */ instruction("SHLO_R_IMM_ALT_64", Arguments.TwoRegOneImm, 1),
  /* 157 */ instruction("SHAR_R_IMM_ALT_64", Arguments.TwoRegOneImm, 1),
  /* 158 */ instruction("ROT_R_64_IMM", Arguments.TwoRegOneImm, 1),
  /* 159 */ instruction("ROT_R_64_IMM_ALT", Arguments.TwoRegOneImm, 1),

  /* 160 */ instruction("ROT_R_32_IMM", Arguments.TwoRegOneImm, 1),
  /* 161 */ instruction("ROT_R_32_IMM_ALT", Arguments.TwoRegOneImm, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 170 */ instruction("BRANCH_EQ", Arguments.TwoRegOneOff, 1, true),
  /* 171 */ instruction("BRANCH_NE", Arguments.TwoRegOneOff, 1, true),
  /* 172 */ instruction("BRANCH_LT_U", Arguments.TwoRegOneOff, 1, true),
  /* 173 */ instruction("BRANCH_LT_S", Arguments.TwoRegOneOff, 1, true),
  /* 174 */ instruction("BRANCH_GE_U", Arguments.TwoRegOneOff, 1, true),
  /* 175 */ instruction("BRANCH_GE_S", Arguments.TwoRegOneOff, 1, true),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 180 */ instruction("LOAD_IMM_JUMP_IND", Arguments.TwoRegTwoImm, 1, true),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 190 */ instruction("ADD_32", Arguments.ThreeReg, 1),
  /* 191 */ instruction("SUB_32", Arguments.ThreeReg, 1),
  /* 192 */ instruction("MUL_32", Arguments.ThreeReg, 1),
  /* 193 */ instruction("DIV_U_32", Arguments.ThreeReg, 1),
  /* 194 */ instruction("DIV_S_32", Arguments.ThreeReg, 1),
  /* 195 */ instruction("REM_U_32", Arguments.ThreeReg, 1),
  /* 196 */ instruction("REM_S_32", Arguments.ThreeReg, 1),
  /* 197 */ instruction("SHLO_L_32", Arguments.ThreeReg, 1),
  /* 198 */ instruction("SHLO_R_32", Arguments.ThreeReg, 1),
  /* 199 */ instruction("SHAR_R_32", Arguments.ThreeReg, 1),

  /* 200 */ instruction("ADD_64", Arguments.ThreeReg, 1),
  /* 201 */ instruction("SUB_64", Arguments.ThreeReg, 1),
  /* 202 */ instruction("MUL_64", Arguments.ThreeReg, 1),
  /* 203 */ instruction("DIV_U_64", Arguments.ThreeReg, 1),
  /* 204 */ instruction("DIV_S_64", Arguments.ThreeReg, 1),
  /* 205 */ instruction("REM_U_64", Arguments.ThreeReg, 1),
  /* 206 */ instruction("REM_S_64", Arguments.ThreeReg, 1),
  /* 207 */ instruction("SHLO_L_64", Arguments.ThreeReg, 1),
  /* 208 */ instruction("SHLO_R_64", Arguments.ThreeReg, 1),
  /* 209 */ instruction("SHAR_R_64", Arguments.ThreeReg, 1),

  /* 210 */ instruction("AND", Arguments.ThreeReg, 1),
  /* 211 */ instruction("XOR", Arguments.ThreeReg, 1),
  /* 212 */ instruction("OR", Arguments.ThreeReg, 1),
  /* 213 */ instruction("MUL_UPPER_S_S", Arguments.ThreeReg, 1),
  /* 214 */ instruction("MUL_UPPER_U_U", Arguments.ThreeReg, 1),
  /* 215 */ instruction("MUL_UPPER_S_U", Arguments.ThreeReg, 1),
  /* 216 */ instruction("SET_LT_U", Arguments.ThreeReg, 1),
  /* 217 */ instruction("SET_LT_S", Arguments.ThreeReg, 1),
  /* 218 */ instruction("CMOV_IZ", Arguments.ThreeReg, 1),
  /* 219 */ instruction("CMOV_NZ", Arguments.ThreeReg, 1),

  /* 220 */ instruction("ROT_L_64", Arguments.ThreeReg, 1),
```
