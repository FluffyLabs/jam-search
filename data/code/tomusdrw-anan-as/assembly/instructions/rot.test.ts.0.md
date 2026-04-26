---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/rot.test.ts#L1-L96
title: assembly/instructions/rot.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 10983ed03fe4e005cb74c32b72200549bc629315517ee89463880d3507b447b9
language: typescript
---
`assembly/instructions/rot.test.ts` (lines 1–96)

```typescript
import { Args } from "../arguments";
import { MemoryBuilder } from "../memory";
import { newRegisters } from "../registers";
import { Assert, Test, test } from "../test";
import { Outcome, OutcomeData } from "./outcome";
import { rot_l_32, rot_l_64, rot_r_64_imm, rot_r_64_imm_alt } from "./rot";
import { Inst } from "./utils";

export const TESTS: Test[] = [
  test("rot_r_64_imm", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0x8;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xdead_beef;

    const memo = new MemoryBuilder().build();

    // when
    const ret = rot_r_64_imm(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.b)], 0xef00_0000_00de_adbe);
    return assert;
  }),
  test("rot_r_64_imm_alt", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0xdead_beef;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0x8;

    const memo = new MemoryBuilder().build();

    // when
    const ret = rot_r_64_imm_alt(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.b)], 0xefff_ffff_ffde_adbe);
    return assert;
  }),
  test("rot_l_64", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0x8;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0x8;
    regs[Inst.reg(args.b)] = 0xdead_beef;

    const memo = new MemoryBuilder().build();

    // when
    const ret = rot_l_64(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 0x0000_00de_adbe_ef00);
    return assert;
  }),
  test("rot_l_32", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x0;
    args.b = 0x1;
    args.c = 0x8;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0x8;
    regs[Inst.reg(args.b)] = 0xdead_beef;

    const memo = new MemoryBuilder().build();

    // when
    const ret = rot_l_32(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 0xffff_ffff_adbe_efde);
    return assert;
  }),
];
```
