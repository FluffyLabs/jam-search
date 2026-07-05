---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L545-L665
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 5
chunk_total: 9
content_sha: a4868f0875b364770ba99a47f0c01c77fd44557b723acebc37ac9eadb4deec11
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 545–665)

```typescript
    mathOps.divUnsignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned (by zero) U64", () => {
    const firstValue = 25n;
    const secondValue = 0n;
    const resultValue = 2n ** 64n - 1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divUnsignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divSigned (positive numbers) U32", () => {
    const firstValue = 26n;
    const secondValue = 2n;
    const resultValue = 13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (positive numbers) U64", () => {
    const firstValue = 26n;
    const secondValue = 2n;
    const resultValue = 13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (negative numbers) U32", () => {
    const firstValue = -26n;
    const secondValue = -2n;
    const resultValue = 13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (negative numbers) U64", () => {
    const firstValue = -26n;
    const secondValue = -2n;
    const resultValue = 13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (positive and negative numbers) U32", () => {
    const firstValue = -26n;
    const secondValue = 2n;
    const resultValue = -13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (positive and negative numbers) U64", () => {
    const firstValue = -26n;
    const secondValue = 2n;
    const resultValue = -13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (negative and positive numbers) U32", () => {
    const firstValue = 26n;
    const secondValue = -2n;
    const resultValue = -13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (negative and positive numbers) U64", () => {
    const firstValue = 26n;
    const secondValue = -2n;
    const resultValue = -13n;
```
