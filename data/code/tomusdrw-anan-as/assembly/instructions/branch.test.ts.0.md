---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/branch.test.ts#L1-L31
title: assembly/instructions/branch.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: f31c17f9dc464f2ff127b6c8576665c6616252d38ec0c37631d1a9fc14f65ff4
language: typescript
---
`assembly/instructions/branch.test.ts` (lines 1–31)

```typescript
import { Args } from "../arguments";
import { MemoryBuilder } from "../memory";
import { newRegisters } from "../registers";
import { Assert, Test, test } from "../test";
import { branch_eq_imm } from "./branch";
import { Outcome, OutcomeData } from "./outcome";
import { Inst } from "./utils";

export const TESTS: Test[] = [
  test("branch_eq_imm", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0;
    args.b = 0xfe;
    args.c = 0xdeadbeef;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xfe;

    const memo = new MemoryBuilder().build();

    // when
    const ret = branch_eq_imm(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.StaticJump, "outcome");
    assert.isEqual(ret.staticJump, 0xdeadbeef, "staticJump");
    return assert;
  }),
];
```
