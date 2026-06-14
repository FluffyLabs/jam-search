---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L392-L500
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 4
chunk_total: 7
content_sha: bedbfc1a798a22896bab2ff687e26d295e6a0d3945f6ec3f5bbf870970a0ab50
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 392–500)

```typescript
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRight (negative number) U32", () => {
    const firstValue = -8n;
    const secondValue = 3n;
    const resultValue = -1n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRight with arg overflow U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 35n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRight (positive number) U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRight (negative number) U64", () => {
    const firstValue = -8n;
    const secondValue = 3n;
    const resultValue = -1n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRight with arg overflow U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 67n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftArithmeticRightU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediateAlternative (positive number) U32", () => {
    const firstValue = 3n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediateAlternative (negative number) U32", () => {
    const firstValue = 3n;
    const secondValue = -8n;
    const resultValue = -1n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediateAlternative with arg overflow U32", () => {
    const firstValue = 35n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

```
