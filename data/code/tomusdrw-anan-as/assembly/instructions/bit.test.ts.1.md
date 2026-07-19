---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/bit.test.ts#L140-L211
title: assembly/instructions/bit.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 22df51f579f111f2027fffcda5328bec1c1317e103f695442ac099970b5444cf
language: typescript
---
`assembly/instructions/bit.test.ts` (lines 140–211)

```typescript
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xdead_beef;
    const memo = new MemoryBuilder().build();

    // when
    const res = sign_extend_8(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 0xffff_ffff_ffff_ffef);
    return assert;
  }),
  test("sign_extend_16", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xdead_beef;
    const memo = new MemoryBuilder().build();

    // when
    const res = sign_extend_16(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 0xffff_ffff_ffff_beef);
    return assert;
  }),
  test("zero_extend_16", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xdead_beef;
    const memo = new MemoryBuilder().build();

    // when
    const res = zero_extend_16(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 0x0000_beef);
    return assert;
  }),
  test("reverse_bytes", () => {
    // when
    const r = new OutcomeData();
    const args = new Args();
    args.a = 0x1;
    args.b = 0xf;
    const regs = newRegisters();
    regs[Inst.reg(args.a)] = 0xfff0_dead_beef;
    const memo = new MemoryBuilder().build();

    // when
    const res = reverse_bytes(r, args, regs, memo);

    // then
    const assert = new Assert();
    assert.isEqual(res.outcome, Outcome.Ok, "outcome");
    assert.isEqual(regs[Inst.reg(0xf)], 0xefbe_adde_f0ff_0000);
    return assert;
  }),
];
```
