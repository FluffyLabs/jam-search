---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L659-L782
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 6
chunk_total: 9
content_sha: c40b298d667843b5711ba0d8fafb5826093212473087591bf26be9622a1efe9a
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 659–782)

```typescript
    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (negative and positive numbers) U64", () => {
    const firstValue = 26n;
    const secondValue = -2n;
    const resultValue = -13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (rounding positive number) U32", () => {
    const firstValue = 25n;
    const secondValue = 2n;
    const resultValue = 12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (rounding positive number) U64", () => {
    const firstValue = 25n;
    const secondValue = 2n;
    const resultValue = 12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (rounding negative number) U32", () => {
    const firstValue = -25n;
    const secondValue = 2n;
    const resultValue = -12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (rounding negative number) U64", () => {
    const firstValue = -25n;
    const secondValue = 2n;
    const resultValue = -12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (by zero) U32", () => {
    const firstValue = 25n;
    const secondValue = 0n;
    const resultValue = -1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned (by zero) U64", () => {
    const firstValue = 25n;
    const secondValue = 0n;
    const resultValue = -1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned with overflow U32", () => {
    const firstValue = -(2n ** 31n);
    const secondValue = -1n;
    const resultValue = firstValue;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divSignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("divSigned with overflow U64", () => {
    const firstValue = -(2n ** 63n);
    const secondValue = -1n;
    const resultValue = firstValue;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

```
