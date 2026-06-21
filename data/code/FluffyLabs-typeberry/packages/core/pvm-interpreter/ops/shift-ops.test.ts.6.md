---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L585-L602
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 6
chunk_total: 7
content_sha: b48b552b3a4c9638a1e8c4e182e8976a7c08420c9248bce77c05d8cd172a5699
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 585–602)

```typescript
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });

  it("shiftArithmeticRightImmediate with arg overflow U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 67n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftArithmeticRightImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
  });
});
```
