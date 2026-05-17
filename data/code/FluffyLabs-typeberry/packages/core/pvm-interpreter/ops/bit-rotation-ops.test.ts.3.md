---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L298-L398
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 3
chunk_total: 7
content_sha: cf09e2a3345154e6b8962cf270e384200deef034a61349a260bba11efff052b9
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 298–398)

```typescript
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (positive number, max value and max shift)", () => {
        const value = 0x7f_ff_ff_fen;
        const shift = 31n;
        const expectedValue = 0xfffffffffffffffcn;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78n;
        const shift = 16n;
        const expectedValue = 0xffffffffa988edcbn;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (no rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 0n;
        const expectedValue = 0xff_ff_ff_ff_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 32n;
        const expectedValue = 0xff_ff_ff_ff_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 128n;
        const expectedValue = 0xff_ff_ff_ff_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });

    describe("rotR64Imm", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 28n;
        const expectedValue = 0xa_bc_de_f0_12_34_56_78_9n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR64Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78_9a_bc_de_f0n;
        const shift = 28n;
        const expectedValue = 0x5432110edcba9876n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR64Imm(firstRegisterIndex, immediate, resultRegisterIndex);

```
