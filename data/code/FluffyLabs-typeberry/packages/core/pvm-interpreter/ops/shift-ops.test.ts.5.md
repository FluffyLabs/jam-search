---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L497-L588
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 5
chunk_total: 7
content_sha: dfc6f9008ab8d17d3914cc06886ff7fb232682ef0f3a72a1d0eac3fedd2a018d
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 497–588)

```typescript
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediateAlternative (positive number) U64", () => {
    const firstValue = 3n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediateAlternative (negative number) U64", () => {
    const firstValue = 3n;
    const secondValue = -8n;
    const resultValue = -1n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediateAlternative with arg overflow U64", () => {
    const firstValue = 67n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateAlternativeU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediate (positive number) U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediate (negative number) U32", () => {
    const firstValue = -8n;
    const secondValue = 3n;
    const resultValue = -1n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediate with arg overflow U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 35n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediate (positive number) U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediate (negative number) U64", () => {
    const firstValue = -8n;
    const secondValue = 3n;
    const resultValue = -1n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

```
