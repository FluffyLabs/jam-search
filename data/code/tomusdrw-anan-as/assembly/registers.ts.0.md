---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/registers.ts#L1-L14'
title: assembly/registers.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bc012a38ee7ac57b53ee53e47a546a8c4fe16f1e252a375839287dd0b506ed5e
language: typescript
---
`assembly/registers.ts` (lines 1–14)

```typescript
type Register = u64;

export const NO_OF_REGISTERS = 13;
export const REG_SIZE_BYTES = 8;

export type Registers = StaticArray<Register>;

export function newRegisters(): Registers {
  const regs = new StaticArray<Register>(NO_OF_REGISTERS);
  for (let i = 0; i < NO_OF_REGISTERS; i++) {
    regs[i] = u64(0);
  }
  return regs;
}
```
