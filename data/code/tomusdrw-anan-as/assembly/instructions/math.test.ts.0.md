---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/math.test.ts#L1-L105
title: assembly/instructions/math.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f3a8bd97226da415ac1a260d9cdc14de157e5edcd54dc1bc862e9e48e604a8f2
language: typescript
---
`assembly/instructions/math.test.ts` (lines 1–105)

```typescript
import { Args } from "../arguments";
import { MemoryBuilder } from "../memory";
import { newRegisters } from "../registers";
import { Assert, Test, test } from "../test";
import * as math from "./math";
import { Outcome, OutcomeData } from "./outcome";
import { Inst } from "./utils";

export const TESTS: Test[] = [
  test("max", () => {
    // when
    const r = new OutcomeData();
    const args = new Args().fill(0x0, 0x1, 0x3);
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = -(2 ** 63);
    regs[Inst.reg(args.b)] = 2;

    const memo = new MemoryBuilder().build();

    // when
    const ret = math.max(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 2);
    return assert;
  }),
  test("max_u", () => {
    // when
    const r = new OutcomeData();
    const args = new Args().fill(0x0, 0x1, 0x3);
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = -(2 ** 63);
    regs[Inst.reg(args.b)] = 2;

    const memo = new MemoryBuilder().build();

    // when
    const ret = math.max_u(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], -(2 ** 63));
    return assert;
  }),
  test("min", () => {
    // when
    const r = new OutcomeData();
    const args = new Args().fill(0x0, 0x1, 0x3);
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = -(2 ** 63);
    regs[Inst.reg(args.b)] = 2;

    const memo = new MemoryBuilder().build();

    // when
    const ret = math.min(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], -(2 ** 63));
    return assert;
  }),
  test("min_u", () => {
    // when
    const r = new OutcomeData();
    const args = new Args().fill(0x0, 0x1, 0x3);
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = -(2 ** 63);
    regs[Inst.reg(args.b)] = 2;

    const memo = new MemoryBuilder().build();

    // when
    const ret = math.min_u(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 2);
    return assert;
  }),
  test("add_32", () => {
    // when
    const r = new OutcomeData();
    const args = new Args().fill(0x0, 0x1, 0x3);
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 2 ** 64 - 1;
    regs[Inst.reg(args.b)] = 2 ** 64 - 1;

    const memo = new MemoryBuilder().build();

    // when
    const ret = math.add_32(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(ret.outcome, Outcome.Ok, "outcome");
    assert.isEqual<u64>(regs[Inst.reg(args.c)], 0xffff_ffff_ffff_fffe);
    return assert;
  }),
];
```
