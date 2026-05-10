---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L303-L398
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 3
chunk_total: 7
content_sha: 31671f57ead62ca0cd96ea409af35d54c2a00f76d8a7edd4c9a6f342663d7c51
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 303–398)

```typescript
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative with arg overflow U32", () => {
    const firstValue = 35n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRightImmediateAlternative U64", () => {
    const firstValue = 3n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative with arg overflow U64", () => {
    const firstValue = 67n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRightImmediate U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRightImmediate with arg overflow U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 35n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRightImmediate U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRightImmediate with arg overflow U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 67n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRight (positive number) U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
```
