---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-ops.test.ts#L113-L225
title: packages/core/pvm-interpreter/ops/bit-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 201f43f138a54826c61fd8fc5c2ffc579519bd02a2a30ba1c27f7a0c8c033b1d
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-ops.test.ts` (lines 113–225)

```typescript
    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("orInv", () => {
    const firstValue = 0b10n;
    const secondValue = 0b01n;
    const resultValue = 0xff_ff_ff_ff_ff_ff_ff_fen;
    const { bitOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.orInv(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("xnor", () => {
    const firstValue = 0b101n;
    const secondValue = 0b110n;
    const resultValue = 0xff_ff_ff_ff_ff_ff_ff_fcn;
    const { bitOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.xnor(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  describe("countSetBits64", () => {
    it("should return no of 1s in bigint", () => {
      const value = 0b101n;
      const resultValue = 2n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.countSetBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of 1s in bigint (min value)", () => {
      const value = 0n;
      const resultValue = 0n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.countSetBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of 1s in bigint (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 64n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.countSetBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("countSetBits32", () => {
    it("should return no of 1s in number", () => {
      const value = 0b101n;
      const resultValue = 2n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.countSetBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of 1s in number (min value)", () => {
      const value = 0n;
      const resultValue = 0n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.countSetBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of 1s in number (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 32n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.countSetBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("leadingZeroBits64", () => {
    it("should return no of leading 0s in bigint", () => {
      const value = 0b101n;
      const resultValue = 61n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of leading 0s in bigint (min value)", () => {
      const value = 0n;
      const resultValue = 64n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits64(firstRegisterIndex, resultRegisterIndex);

```
