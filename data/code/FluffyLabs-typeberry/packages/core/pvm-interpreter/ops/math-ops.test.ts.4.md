---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L428-L551
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 4
chunk_total: 9
content_sha: c0f3429f7097dff655a16668780b46c377bfe3ae1e77efc64334add34609747d
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 428–551)

```typescript
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSS(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSU (positive numbers)", () => {
    const firstValue = 2n ** 60n;
    const secondValue = 2n ** 60n;
    const resultValue = 2n ** 56n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSU (negative and positive)", () => {
    const firstValue = -(2n ** 60n);
    const secondValue = 2n ** 60n;
    const resultValue = -(2n ** 56n);
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("mulUpperSU (a case from test vectors)", () => {
    const firstValue = 0xffffffff80000000n;
    const secondValue = 0xffffffffffff8000n;
    const resultValue = 0xffffffff80000000n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulUpperSU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned U32", () => {
    const firstValue = 26n;
    const secondValue = 2n;
    const resultValue = 13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divUnsignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned U64", () => {
    const firstValue = 26n;
    const secondValue = 2n;
    const resultValue = 13n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divUnsignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned (rounding) U32", () => {
    const firstValue = 25n;
    const secondValue = 2n;
    const resultValue = 12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divUnsignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned (rounding) U64", () => {
    const firstValue = 25n;
    const secondValue = 2n;
    const resultValue = 12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divUnsignedU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned (by zero) U32", () => {
    const firstValue = 25n;
    const secondValue = 0n;
    const resultValue = 2n ** 64n - 1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.divUnsignedU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("divUnsigned (by zero) U64", () => {
    const firstValue = 25n;
```
