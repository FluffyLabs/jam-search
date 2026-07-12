---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L113-L231
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 9
content_sha: 8e8563bd144f302d51bc74ecf1b612fca46654dfeddbe0ac89101dc36dd5347b
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 113–231)

```typescript
    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("sub with overflow U32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 2n ** 64n - 1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.subU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("sub with overflow U64", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 2n ** 64n - 1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.subU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("negAddImmediate U32", () => {
    const firstValue = 13n;
    const secondValue = 12n;
    const resultValue = 1n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.negAddImmediateU32(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("negAddImmediate U64", () => {
    const firstValue = 13n;
    const secondValue = 12n;
    const resultValue = 1n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.negAddImmediateU64(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("negAddImmediate with overflow U32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 2n ** 64n - 1n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.negAddImmediateU32(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("negAddImmediate with overflow U64", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 2n ** 64n - 1n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.negAddImmediateU64(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mul U32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 156n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mul U64", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 156n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mul with overflow U32", () => {
    const firstValue = 2n ** 17n + 1n;
    const secondValue = 2n ** 18n;
    const resultValue = 262144n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.mulU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("mul with overflow U64", () => {
    const firstValue = 2n ** 57n + 1n;
```
