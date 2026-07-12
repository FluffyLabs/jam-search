---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-ops.test.ts#L220-L327
title: packages/core/pvm-interpreter/ops/bit-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 831db74a31cdcdfbe8b72bd7b731c8a08d5207833698e0daea8d9342c069013b
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-ops.test.ts` (lines 220–327)

```typescript
      const value = 0n;
      const resultValue = 64n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of leading 0s in bigint (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 0n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("leadingZeroBits32", () => {
    it("should return no of leading 0s in number", () => {
      const value = 0b101n;
      const resultValue = 29n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of leading 0s in number (min value)", () => {
      const value = 0n;
      const resultValue = 32n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of leading 0s in number (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 0n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.leadingZeroBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("trailingZeroBits64", () => {
    it("should return no of trailing 0s in bigint", () => {
      const value = 0b1010n;
      const resultValue = 1n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.trailingZeroBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of trailing 0s in bigint (min value)", () => {
      const value = 0n;
      const resultValue = 64n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.trailingZeroBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of trailing 0s in bigint (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 0n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.trailingZeroBits64(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("leadingZeroBits32", () => {
    it("should return no of trailing 0s in number", () => {
      const value = 0b1010n;
      const resultValue = 1n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.trailingZeroBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of trailing 0s in number (min value)", () => {
      const value = 0n;
      const resultValue = 32n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.trailingZeroBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of trailing 0s in number (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 0n;
```
