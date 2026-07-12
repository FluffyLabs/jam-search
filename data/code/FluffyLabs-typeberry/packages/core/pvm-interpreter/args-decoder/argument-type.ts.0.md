---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/argument-type.ts#L1-L15
title: packages/core/pvm-interpreter/args-decoder/argument-type.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 40d33907d629fbcc26819661ae91beb80ccf3c22a5e03dbbbe50e29cdc3acf2b
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/argument-type.ts` (lines 1–15)

```typescript
export enum ArgumentType {
  NO_ARGUMENTS = 0,
  ONE_IMMEDIATE = 1,
  TWO_IMMEDIATES = 2,
  ONE_OFFSET = 3,
  ONE_REGISTER_ONE_IMMEDIATE = 4,
  ONE_REGISTER_TWO_IMMEDIATES = 5,
  ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET = 6,
  TWO_REGISTERS = 7,
  TWO_REGISTERS_ONE_IMMEDIATE = 8,
  TWO_REGISTERS_ONE_OFFSET = 9,
  TWO_REGISTERS_TWO_IMMEDIATES = 10,
  THREE_REGISTERS = 11,
  ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE = 12,
}
```
