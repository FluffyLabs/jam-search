---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/logic.test.ts#L1-L76
title: assembly/instructions/logic.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b76b8f893943804170709c4d1f84e33f618cd708da3cea2b1be9d717f004dc94
language: typescript
---
`assembly/instructions/logic.test.ts` (lines 1–76)

```typescript
import { Args } from "../arguments";
import { MemoryBuilder } from "../memory";
import { newRegisters } from "../registers";
import { Assert, Test, test } from "../test";
import { and_inv, or_inv, xnor } from "./logic";
import { Outcome, OutcomeData } from "./outcome";
import { Inst } from "./utils";

export const TESTS: Test[] = [
  test("and_inv", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0x3;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0x0000_0000_000f;
    regs[Inst.reg(args.b)] = 0xf000_0000_0001;

    const memo = new MemoryBuilder().build();

    // when
    const ret = and_inv(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 0x0000_f000_0000_0000);
    return assert;
  }),
  test("or_inv", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0x3;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0x0000_0000_000f;
    regs[Inst.reg(args.b)] = 0xf000_0000_0001;

    const memo = new MemoryBuilder().build();

    // when
    const ret = or_inv(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 0xffff_ffff_ffff_fff1);
    return assert;
  }),
  test("xnor", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0x3;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0x0000_0000_000f;
    regs[Inst.reg(args.b)] = 0xf000_0000_0000;

    const memo = new MemoryBuilder().build();

    // when
    const ret = xnor(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 0xffff_0fff_ffff_fff0);
    return assert;
  }),
];
```
