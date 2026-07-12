---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L199-L304
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 7
content_sha: 6cb710778d264cd8e43128ea6f67df1b814d48c2924cf2e6aea5b9c709645798
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 199–304)

```typescript
        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

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

        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });
  });

  describe("rot right", () => {
    describe("rotR64", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 28n;
        const expectedValue = 0xa_bc_de_f0_12_34_56_78_9n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78_9a_bc_de_f0n;
        const shift = 28n;
        const expectedValue = 0x5432110edcba9876n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (no rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 0n;
        const expectedValue = 0x12_34_56_78_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 64n;
        const expectedValue = 0x12_34_56_78_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 128n;
        const expectedValue = 0x12_34_56_78_9a_bc_de_f0n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });

    describe("rotR32", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78n;
        const shift = 12n;
        const expectedValue = 0x67_81_23_45n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotR32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

```
