---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions.ts#L263-L279
title: assembly/instructions.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 5014a44500b4ba8e32d28fa1d0b73d946f79e3a9b34ddeab226fad0be7aa7dc8
language: typescript
---
`assembly/instructions.ts` (lines 263–279)

```typescript
  /* 217 */ instruction("SET_LT_S", Arguments.ThreeReg, 1),
  /* 218 */ instruction("CMOV_IZ", Arguments.ThreeReg, 1),
  /* 219 */ instruction("CMOV_NZ", Arguments.ThreeReg, 1),

  /* 220 */ instruction("ROT_L_64", Arguments.ThreeReg, 1),
  /* 221 */ instruction("ROT_L_32", Arguments.ThreeReg, 1),
  /* 222 */ instruction("ROT_R_64", Arguments.ThreeReg, 1),
  /* 223 */ instruction("ROT_R_32", Arguments.ThreeReg, 1),
  /* 224 */ instruction("AND_INV", Arguments.ThreeReg, 1),
  /* 225 */ instruction("OR_INV", Arguments.ThreeReg, 1),
  /* 226 */ instruction("XNOR", Arguments.ThreeReg, 1),
  /* 227 */ instruction("MAX", Arguments.ThreeReg, 1),
  /* 228 */ instruction("MAX_U", Arguments.ThreeReg, 1),
  /* 229 */ instruction("MIN", Arguments.ThreeReg, 1),

  /* 230 */ instruction("MIN_U", Arguments.ThreeReg, 1),
]);
```
