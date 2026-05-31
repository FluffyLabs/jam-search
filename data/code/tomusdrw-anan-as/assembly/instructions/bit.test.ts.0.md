---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/bit.test.ts#L1-L148
title: assembly/instructions/bit.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 0
chunk_total: 2
content_sha: e96dfa63a448ceb420c9737941587c145a248f99c231909a97c627760d54ccd7
language: typescript
---
`assembly/instructions/bit.test.ts` (lines 1–148)

```typescript
import { Args } from "../arguments";
import { MemoryBuilder } from "../memory";
import { newRegisters } from "../registers";
import { Assert, Test, test } from "../test";
import {
  count_set_bits_32,
  count_set_bits_64,
  leading_zero_bits_32,
  leading_zero_bits_64,
  reverse_bytes,
  sign_extend_8,
  sign_extend_16,
  trailing_zero_bits_32,
  trailing_zero_bits_64,
  zero_extend_16,
} from "./bit";
import { Outcome, OutcomeData } from "./outcome";
import { Inst } from "./utils";

export const TESTS: Test[] = [
  test("count_set_bits_64", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xffff_0000_1111;
    const memo = new MemoryBuilder().build();

    // when
    const res = count_set_bits_64(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 2 * 8 + 4);
    return assert;
  }),
  test("count_set_bits_32", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xffff_0000_1111;
    const memo = new MemoryBuilder().build();

    // when
    const res = count_set_bits_32(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 4);
    return assert;
  }),
  test("leading_zero_bits_64", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xfff0_0000_0111;
    const memo = new MemoryBuilder().build();

    // when
    const res = leading_zero_bits_64(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 16);
    return assert;
  }),
  test("leading_zero_bits_32", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xffff_0000_1111;
    const memo = new MemoryBuilder().build();

    // when
    const res = leading_zero_bits_32(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 19);
    return assert;
  }),
  test("trailing_zero_bits_64", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xfff0_0000_0000;
    const memo = new MemoryBuilder().build();

    // when
    const res = trailing_zero_bits_64(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 36);
    return assert;
  }),
  test("trailing_zero_bits_32", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xfff0_0000_0000;
    const memo = new MemoryBuilder().build();

    // when
    const res = trailing_zero_bits_32(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 32);
    return assert;
  }),
  test("sign_extend_8", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xdead_beef;
    const memo = new MemoryBuilder().build();

    // when
    const res = sign_extend_8(r, args, regs, memo);

    // then
```
