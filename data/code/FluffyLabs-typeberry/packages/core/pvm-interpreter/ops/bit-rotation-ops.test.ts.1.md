---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L101-L204
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 7
content_sha: 5c78c9b128cbd1283b51137db6f999f489e75576fd8034515c79b3907fc2398e
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 101–204)

```typescript
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

        bitRotationOps.rotL64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

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

        bitRotationOps.rotL64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });

    describe("rotL32", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78n;
        const shift = 12n;
        const expectedValue = 0x4_56_78_12_3n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (positive number, max value and max shift)", () => {
        const value = 0x7f_ff_ff_fen;
        const shift = 31n;
        const expectedValue = 0x3f_ff_ff_ffn;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

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

        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

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

        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

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

        bitRotationOps.rotL32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
```
