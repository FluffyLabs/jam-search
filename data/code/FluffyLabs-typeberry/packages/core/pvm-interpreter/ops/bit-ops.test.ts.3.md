---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-ops.test.ts#L322-L411
title: packages/core/pvm-interpreter/ops/bit-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 3
chunk_total: 4
content_sha: ce95a9de170007b7ff5770c288eaa29d7137b92f94f166c0c50a4c28c47104f1
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-ops.test.ts` (lines 322–411)

```typescript
      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });

    it("should return no of trailing 0s in number (max value)", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 0n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.trailingZeroBits32(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("signExtend8", () => {
    it("should extend sign", () => {
      const value = 0x80n;
      const resultValue = -0x80n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.signExtend8(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
    });

    it("should not extend sign", () => {
      const value = 0x70n;
      const resultValue = 0x70n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.signExtend8(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
    });

    it("should extend sign but should not change the least significant 8 bits", () => {
      const value = 0x00006d6d6d6dd48dn;
      const resultValue = 0xffffffffffffff8dn;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.signExtend8(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("signExtend16", () => {
    it("should extend sign", () => {
      const value = 0x8000n;
      const resultValue = -0x8000n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.signExtend16(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
    });

    it("should not extend sign", () => {
      const value = 0x7000n;
      const resultValue = 0x7000n;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.signExtend16(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getI64(resultRegisterIndex), resultValue);
    });

    it("should extend sign but should not change the least significant 16 bits", () => {
      const value = 0x00006d6d6d6dd46dn;
      const resultValue = 0xffffffffffffd46dn;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.signExtend16(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });

  describe("zeroExtend16", () => {
    it("should override 6 bytes with zeros", () => {
      const value = 2n ** 64n - 1n;
      const resultValue = 0xffffn;
      const { bitOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(value);

      bitOps.zeroExtend16(firstRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
    });
  });
});
```
