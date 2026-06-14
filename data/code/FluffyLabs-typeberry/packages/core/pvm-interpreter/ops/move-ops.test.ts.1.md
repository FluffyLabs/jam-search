---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/move-ops.test.ts#L111-L148
title: packages/core/pvm-interpreter/ops/move-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: b9ac473df43a998b26ff9de1f559e79d69e5485a5837e4fce5d4dcc3b67999c3
language: typescript
---
`packages/core/pvm-interpreter/ops/move-ops.test.ts` (lines 111–148)

```typescript
    moveOps.cmovIfZeroImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfZeroImmediate (condition not satisfied)", () => {
    const firstValue = 3n;
    const secondValue = 5n;
    const resultValue = 0n;
    const { moveOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    moveOps.cmovIfZeroImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfNotZeroImmediate (condition satisfied)", () => {
    const firstValue = 3n;
    const secondValue = 5n;
    const resultValue = secondValue;
    const { moveOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    moveOps.cmovIfNotZeroImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfNotZeroImmediate (condition not satisfied)", () => {
    const firstValue = 0n;
    const secondValue = 5n;
    const resultValue = 0n;
    const { moveOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    moveOps.cmovIfNotZeroImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });
});
```
