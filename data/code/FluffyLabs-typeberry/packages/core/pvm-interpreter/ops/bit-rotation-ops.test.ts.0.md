---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts#L1-L105
title: packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 7
content_sha: 378fa1af12edc3a51b3a375bbe9325df40952a7333cfacce79ff6a89f082e9ed
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-rotation-ops.test.ts` (lines 1–105)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { BitRotationOps } from "./bit-rotation-ops.js";

describe("BitRotationOps", () => {
  describe("reverseBytes", () => {
    function prepareData(firstValue: bigint) {
      const regs = Registers.empty();
      const valueRegisterIndex = 0;
      const resultRegisterIndex = 12;

      regs.setU64(valueRegisterIndex, firstValue);

      const bitRotationOps = BitRotationOps.new(regs);

      return { regs, bitRotationOps, valueRegisterIndex, resultRegisterIndex };
    }

    it("should reverse bytes in positive number", () => {
      const value = 0x12_34_56_78_9a_bc_de_f0n;
      const expectedValue = 0xf0_de_bc_9a_78_56_34_12n;
      const { bitRotationOps, regs, resultRegisterIndex, valueRegisterIndex } = prepareData(value);

      bitRotationOps.reverseBytes(valueRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
    });

    it("should reverse bytes in negative number", () => {
      const value = -0x12_34_56_78_9a_bc_de_f0n;
      const expectedValue = 0x10_21_43_65_87_a9_cb_edn;
      const { bitRotationOps, regs, resultRegisterIndex, valueRegisterIndex } = prepareData(value);

      bitRotationOps.reverseBytes(valueRegisterIndex, resultRegisterIndex);

      assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
    });
  });

  function prepareData(firstValue: bigint, secondValue: bigint) {
    const regs = Registers.empty();
    const firstRegisterIndex = 0;
    const secondRegisterIndex = 1;
    const resultRegisterIndex = 12;

    regs.setU64(firstRegisterIndex, firstValue);
    regs.setU64(secondRegisterIndex, secondValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    const bitRotationOps = BitRotationOps.new(regs);

    return { regs, bitRotationOps, immediate, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex };
  }

  describe("rot left", () => {
    describe("rotL64", () => {
      it("should correctly rotate bits (positive number)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
        const shift = 28n;
        const expectedValue = 0x8_9a_bc_de_f0_12_34_56_7n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotL64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (negative number)", () => {
        const value = -0x12_34_56_78_9a_bc_de_f0n;
        const shift = 28n;
        const expectedValue = 0x765432110edcba98n;
        const { bitRotationOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
          value,
          shift,
        );

        bitRotationOps.rotL64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

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

        bitRotationOps.rotL64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

        assert.strictEqual(regs.getU64(resultRegisterIndex), expectedValue);
      });

      it("should correctly rotate bits (full rotation)", () => {
        const value = 0x12_34_56_78_9a_bc_de_f0n;
```
