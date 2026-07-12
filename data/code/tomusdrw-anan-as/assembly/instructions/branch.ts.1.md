---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/branch.ts#L125-L136
title: assembly/instructions/branch.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 1
chunk_total: 2
content_sha: 988a61a98a2713547fcc0169081c73b30a65bcceb67dbf1f074accc2917c8368
language: typescript
---
`assembly/instructions/branch.ts` (lines 125–136)

```typescript
    return OutcomeData.staticJump(r, args.c);
  }
  return OutcomeData.ok(r);
};

// BRANCH_GE_S
export const branch_ge_s: InstructionRun = (r, args, registers) => {
  if (i64(registers[Inst.reg(args.b)]) >= i64(registers[Inst.reg(args.a)])) {
    return OutcomeData.staticJump(r, args.c);
  }
  return OutcomeData.ok(r);
};
```
