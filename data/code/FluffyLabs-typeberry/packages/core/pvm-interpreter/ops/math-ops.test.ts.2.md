---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L225-L332
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 9
content_sha: dcac0958be2b024c1875792e687a010f683010d7e42d71b52e59973207ed3eec
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 225–332)

```typescript
    mathOps.mulU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mul with overflow U64", () => {
    const firstValue = 2n ** 57n + 1n;
    const secondValue = 2n ** 58n;
    const resultValue = 288230376151711744n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulImmediate U32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 156n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulImmediateU32(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulImmediate U64", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 156n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulImmediateU64(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulImmediate with overflow U32", () => {
    const firstValue = 2n ** 17n + 1n;
    const secondValue = 2n ** 18n;
    const resultValue = 262144n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulImmediateU32(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulImmediate with overflow U64", () => {
    const firstValue = 2n ** 64n - 1n;
    const secondValue = 2n ** 18n;
    const resultValue = 18446744073709289472n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulImmediateU64(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulUpperUUImmediate", () => {
    const firstValue = 2n ** 30n;
    const secondValue = 2n ** 60n;
    const resultValue = 2n ** 26n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulUpperUUImmediate(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulUpperUUImmediate (max unsigned value)", () => {
    const firstValue = 2n ** 32n - 1n;
    const secondValue = 2n ** 64n - 1n;
    const resultValue = 2n ** 64n - 2n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.mulUpperUUImmediate(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulUpperUU", () => {
    const firstValue = 2n ** 60n;
    const secondValue = 2n ** 60n;
    const resultValue = 2n ** 56n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperUU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mulUpperUU (max unsigned value)", () => {
    const firstValue = 2n ** 64n - 1n;
    const secondValue = 2n ** 64n - 1n;
    const resultValue = 2n ** 64n - 2n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

```
