---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/math.ts#L231-L242
title: assembly/instructions/math.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 1e55e5b56ca2312ca6d6e22d2ecacf75df2255f9ed19d41b12ec000c157c015d
language: typescript
---
`assembly/instructions/math.ts` (lines 231–242)

```typescript
  const b = i64(registers[Inst.reg(args.b)]);
  registers[Inst.reg(args.c)] = u64(a > b ? b : a);
  return OutcomeData.ok(r);
};

// MIN_U
export const min_u: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.a)];
  const b = registers[Inst.reg(args.b)];
  registers[Inst.reg(args.c)] = a > b ? b : a;
  return OutcomeData.ok(r);
};
```
