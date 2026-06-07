---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L395-L484
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 7
content_sha: 3005ee11a88a0bfe154a40051a4ac8a914cb2e6522eb53de793c42f297fa1769
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 395–484)

```typescript
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR64Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (no rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 0n;
        const expectedValue = 0x12_34_56_78_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR64Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 64n;
        const expectedValue = 0x12_34_56_78_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR64Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 128n;
        const expectedValue = 0x12_34_56_78_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR64Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });

    describe("rotR64ImmAlt", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78n;
        const shift = 28n;
        const expectedValue = 0x2345678000000001n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR64ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78n;
        const shift = 28n;
        const expectedValue = 0xdcba988ffffffffen;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR64ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (no rotation)", () => {
        const value = 0x12_34_56_78n;
        const shift = 0n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR64ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78n;
        const shift = 64n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR64ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78n;
        const shift = 128n;
        const expectedValue = 0x12345678n;
```
