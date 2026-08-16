---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.test.ts#L1-L119
title: packages/core/pvm-interpreter/ops/math-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 9
content_sha: 4e891e13c183ea0e4d2e9a6bac332fb2ed00e30053d18161e4ecd703a63f8e52
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.test.ts` (lines 1–119)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { MathOps } from "./math-ops.js";

describe("MathOps", () => {
  function prepareData(firstValue: bigint, secondValue: bigint) {
    const regs = Registers.empty();
    const firstValRegIndex = 0;
    const secondValRegIndex = 1;
    const resultRegisterIndex = 12;

    regs.setU64(firstValRegIndex, firstValue);
    regs.setU64(secondValRegIndex, secondValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(firstValue));

    const mathOps = MathOps.new(regs);

    return { regs, mathOps, immediate, firstValRegIndex, secondValRegIndex, resultRegisterIndex };
  }

  it("add U32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 25n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.addU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("add with overflow U32", () => {
    const firstValue = 2n ** 32n - 1n;
    const secondValue = 13n;
    const resultValue = 12n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.addU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("addImmediateU32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 25n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.addImmediateU32(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("addImmediateU64", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 25n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.addImmediateU64(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("addImmediate with overflow U32", () => {
    const firstValue = 2n ** 32n - 1n;
    const secondValue = 13n;
    const resultValue = 12n;
    const { regs, mathOps, secondValRegIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    mathOps.addImmediateU32(secondValRegIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("sub", () => {
    const firstValue = 13n;
    const secondValue = 12n;
    const resultValue = 1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.subU32(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("sub U64", () => {
    const firstValue = 13n;
    const secondValue = 12n;
    const resultValue = 1n;
    const { regs, mathOps, firstValRegIndex, secondValRegIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    mathOps.subU64(firstValRegIndex, secondValRegIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("sub with overflow U32", () => {
    const firstValue = 12n;
    const secondValue = 13n;
    const resultValue = 2n ** 64n - 1n;
```
