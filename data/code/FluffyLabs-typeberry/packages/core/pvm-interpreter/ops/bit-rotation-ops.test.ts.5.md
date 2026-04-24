---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L478-L572
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 5
chunk_total: 7
content_sha: 7726a5156cd2610ab5ce20d28824b01628ebddd16ce9340f8d79e0e919681d98
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 478–572)

```typescript
        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78n;
        const shift = 128n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR64ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });

    describe("rotR32Imm", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78n;
        const shift = 12n;
        const expectedValue = 0x67_81_23_45n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR32Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (positive number, max value and max shift)", () => {
        const value = 0x7f_ff_ff_fen;
        const shift = 31n;
        const expectedValue = 0xfffffffffffffffcn;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR32Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78n;
        const shift = 16n;
        const expectedValue = 0xffffffffa988edcbn;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR32Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (no rotation)", () => {
        const value = 0x12_34_56_78n;
        const shift = 0n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR32Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78n;
        const shift = 32n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR32Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78n;
        const shift = 128n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(value, shift);

        bitRotationOps.rotR32Imm(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });

    describe("rotR32ImmAlt", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78n;
        const shift = 12n;
        const expectedValue = 0x67_81_23_45n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

```
