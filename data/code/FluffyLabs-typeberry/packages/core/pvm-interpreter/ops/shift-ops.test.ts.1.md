---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L112-L204
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 7
content_sha: c229cfb1f2c63097cf00154a00e228ae5fa079aa9da6010eeaab0cbfb7ba699d
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 112–204)

```typescript
    const firstValue = 3n;
    const secondValue = 0b0001n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative with arg overflow U32", () => {
    const firstValue = 35n;
    const secondValue = 0b0001n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative with result overflow U32", () => {
    const firstValue = 3n;
    const secondValue = 0xa0_00_00_00n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative U64", () => {
    const firstValue = 3n;
    const secondValue = 0b0001n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative with arg overflow U64", () => {
    const firstValue = 67n;
    const secondValue = 0b0001n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative with result overflow U64", () => {
    const firstValue = 35n;
    const secondValue = 0xa0_00_00_00n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediate U32", () => {
    const firstValue = 0b0001n;
    const secondValue = 3n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediate with arg overflow U32", () => {
    const firstValue = 0b0001n;
    const secondValue = 35n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediate with result overflow U32", () => {
    const firstValue = 0xa0_00_00_00n;
    const secondValue = 3n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

```
