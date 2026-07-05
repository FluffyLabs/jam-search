---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L200-L306
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 7
content_sha: b50d9a3da9fec38b3219b35abce17d9dbb1d1ad68244b10aac81d436a2e66802
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 200–306)

```typescript
    const firstValue = 0xa0_00_00_00n;
    const secondValue = 3n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateU32(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediate U64", () => {
    const firstValue = 0b0001n;
    const secondValue = 3n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediate with arg overflow U64", () => {
    const firstValue = 0b0001n;
    const secondValue = 67n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediate with result overflow U64", () => {
    const firstValue = 0xa0_00_00_00n;
    const secondValue = 35n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalLeftImmediateU64(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRight U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalRightU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRight with arg overflow U32", () => {
    const firstValue = 0b10000n;
    const secondValue = 35n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalRightU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRight U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 3n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalRightU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRight with arg overflow U64", () => {
    const firstValue = 0b10000n;
    const secondValue = 67n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalRightU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalRightImmediateAlternative U32", () => {
    const firstValue = 3n;
    const secondValue = 0b10000n;
    const resultValue = 0b00010n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    shiftOps.shiftLogicalRightImmediateAlternativeU32(firstRegisterIndex, immediate, resultRegisterIndex);

```
