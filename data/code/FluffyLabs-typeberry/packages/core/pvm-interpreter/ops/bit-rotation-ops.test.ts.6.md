---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L566-L629
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 6
chunk_total: 7
content_sha: 751409003b4e791e73b5cdc1207b297fadff9e9ca334d02837026ae8e7bad4a2
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 566–629)

```typescript
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (positive number, max value and max shift)", () => {
        const value = 0x7f_ff_ff_fen;
        const shift = 31n;
        const expectedValue = 0xfffffffffffffffcn;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78n;
        const shift = 16n;
        const expectedValue = 0xffffffffa988edcbn;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (no rotation)", () => {
        const value = 0x12_34_56_78n;
        const shift = 0n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78n;
        const shift = 32n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (shift overflow)", () => {
        const value = 0x12_34_56_78n;
        const shift = 128n;
        const expectedValue = 0x12345678n;
        const { bitRotationOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(shift, value);

        bitRotationOps.rotR32ImmAlt(firstRegisterIndex, immediate, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });
    });
  });
});
```
