---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L326-L434
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 3
chunk_total: 9
content_sha: a658200e211855d83296bc9222dd1d96b9e8f4f23a5ad5b6cb8b7fe3005461a9
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 326–434)

```typescript
    const secondValue = 2n ** 64n - 1n;
    const resultValue = 2n ** 64n - 2n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperUU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSSImmediate (positive numbers)", () => {
    const firstValue = 2n ** 30n;
    const secondValue = 2n ** 60n;
    const resultValue = 2n ** 26n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulUpperSSImmediate(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSSImmediate (negative numbers)", () => {
    const firstValue = -(2n ** 30n);
    const secondValue = -(2n ** 60n);
    const resultValue = 2n ** 26n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulUpperSSImmediate(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSSImmediate (positive and negative)", () => {
    const firstValue = 2n ** 30n;
    const secondValue = -(2n ** 60n);
    const resultValue = -(2n ** 26n);
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulUpperSSImmediate(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSSImmediate (negative and positive)", () => {
    const firstValue = -(2n ** 30n);
    const secondValue = 2n ** 60n;
    const resultValue = -(2n ** 26n);
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulUpperSSImmediate(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSS (positive numbers)", () => {
    const firstValue = 2n ** 60n;
    const secondValue = 2n ** 60n;
    const resultValue = 2n ** 56n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSS(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSS (negative numbers)", () => {
    const firstValue = -(2n ** 60n);
    const secondValue = -(2n ** 60n);
    const resultValue = 2n ** 56n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSS(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSS (positive and negative)", () => {
    const firstValue = 2n ** 60n;
    const secondValue = -(2n ** 60n);
    const resultValue = -(2n ** 56n);
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSS(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSS (negative and positive)", () => {
    const firstValue = -(2n ** 60n);
    const secondValue = 2n ** 30n;
    const resultValue = -(2n ** 26n);
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSS(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

```
