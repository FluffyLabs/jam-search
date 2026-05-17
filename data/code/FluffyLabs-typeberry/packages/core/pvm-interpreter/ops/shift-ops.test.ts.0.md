---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.test.ts#L1-L116
title: packages/core/pvm-interpreter/ops/shift-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 7
content_sha: 84d17274bedac76f2b46d909f14ba0c4b880fc0f15af8ef54dcfdb73ba8ada57
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.test.ts` (lines 1–116)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { ShiftOps } from "./shift-ops.js";

describe("ShiftOps", () => {
  function prepareData(firstValue: bigint, secondValue: bigint) {
    const regs = Registers.empty();
    const firstRegisterIndex = 0;
    const secondRegisterIndex = 1;
    const resultRegisterIndex = 12;

    regs.setU64(firstRegisterIndex, firstValue);
    regs.setU64(secondRegisterIndex, secondValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    const shiftOps = ShiftOps.new(regs);

    return { regs, shiftOps, immediate, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex };
  }

  it("shiftLogicalLeft U32", () => {
    const firstValue = 0b0001n;
    const secondValue = 3n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalLeftU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeft with arg overflow U32", () => {
    const firstValue = 0b0001n;
    const secondValue = 35n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalLeftU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeft with result overflow U32", () => {
    const firstValue = 0xa0_00_00_00n;
    const secondValue = 3n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalLeftU32(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeft U64", () => {
    const firstValue = 0b0001n;
    const secondValue = 3n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalLeftU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeft with arg overflow U64", () => {
    const firstValue = 0b0001n;
    const secondValue = 67n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalLeftU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeft with result overflow U64", () => {
    const firstValue = 0xa0_00_00_00n;
    const secondValue = 35n;
    const resultValue = 0n;
    const { regs, shiftOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    shiftOps.shiftLogicalLeftU64(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("shiftLogicalLeftImmediateAlternative U32", () => {
    const firstValue = 3n;
    const secondValue = 0b0001n;
    const resultValue = 0b1000n;
    const { regs, shiftOps, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

```
