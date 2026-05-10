---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L891-L955
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 8
chunk_total: 9
content_sha: 750f70196a47d7417b403a64754571cb378d07a57a043659e1b6b3b7980a8af1
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 891–955)

```typescript
      firstValue,
      secondValue,
    );

    mathOps.minU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("should calculate max value (positive numbers)", () => {
    const firstValue = 1n;
    const secondValue = 25n;
    const resultValue = secondValue;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.max(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("should calculate max value (negative numbers)", () => {
    const firstValue = -1n;
    const secondValue = -25n;
    const resultValue = firstValue;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.max(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("should calculate maxU value (positive numbers)", () => {
    const firstValue = 1n;
    const secondValue = 25n;
    const resultValue = secondValue;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.maxU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("should calculate maxU value (negative numbers)", () => {
    const firstValue = 0n;
    const secondValue = -25n;
    const resultValue = secondValue;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.maxU(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });
});
```
