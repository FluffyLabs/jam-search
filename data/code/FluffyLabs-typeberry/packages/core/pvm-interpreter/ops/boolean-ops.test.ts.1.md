---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/boolean-ops.test.ts#L98-L171
title: packages/core/pvm-interpreter/ops/boolean-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 10f6ce5384c0fa970b5e0fe8307356f427be6b9ed03fe265886df11a6fe62384
language: typescript
---
`packages/core/pvm-interpreter/ops/boolean-ops.test.ts` (lines 98–171)

```typescript
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setGreaterThanSignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setGreaterThanSignedImmediate - false", () => {
    const firstValue = -3n;
    const secondValue = -2n;
    const resultValue = 0n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setGreaterThanSignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanUnsigned - true", () => {
    const firstValue = 1n;
    const secondValue = 2n;
    const resultValue = 1n;
    const { bitOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex, regs } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.setLessThanUnsigned(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanUnsigned - false", () => {
    const firstValue = 3n;
    const secondValue = 2n;
    const resultValue = 0n;
    const { bitOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex, regs } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.setLessThanUnsigned(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanSigned - true", () => {
    const firstValue = -3n;
    const secondValue = -2n;
    const resultValue = 1n;
    const { bitOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex, regs } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.setLessThanSigned(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanSigned - false", () => {
    const firstValue = -1n;
    const secondValue = -2n;
    const resultValue = 0n;
    const { bitOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex, regs } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.setLessThanSigned(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });
});
```
