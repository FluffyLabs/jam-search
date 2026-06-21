---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/boolean-ops.test.ts#L1-L104
title: packages/core/pvm-interpreter/ops/boolean-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: c5800b805e2a71f6a47c7893dc0c80cf51db78ce1c390ed0cadaa13fc176791a
language: typescript
---
`packages/core/pvm-interpreter/ops/boolean-ops.test.ts` (lines 1–104)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { BooleanOps } from "./boolean-ops.js";

describe("BooleanOps", () => {
  function prepareData(firstValue: bigint, secondValue: bigint) {
    const regs = Registers.empty();
    const firstRegisterIndex = 0;
    const secondRegisterIndex = 1;
    const resultRegisterIndex = 12;

    regs.setU64(firstRegisterIndex, firstValue);
    regs.setU64(secondRegisterIndex, secondValue);
    regs.setU64(resultRegisterIndex, 0xdeadbeefn);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    const bitOps = BooleanOps.new(regs);

    return { regs, bitOps, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex, immediate };
  }

  it("setLessThanUnsignedImmediate - true", () => {
    const firstValue = 1n;
    const secondValue = 2n;
    const resultValue = 1n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setLessThanUnsignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanUnsignedImmediate - false", () => {
    const firstValue = 3n;
    const secondValue = 2n;
    const resultValue = 0n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setLessThanUnsignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setGreaterThanUnsignedImmediate - true", () => {
    const firstValue = 3n;
    const secondValue = 2n;
    const resultValue = 1n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setGreaterThanUnsignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setGreaterThanUnsignedImmediate - false", () => {
    const firstValue = 1n;
    const secondValue = 2n;
    const resultValue = 0n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setGreaterThanUnsignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanSignedImmediate - true", () => {
    const firstValue = -3n;
    const secondValue = -2n;
    const resultValue = 1n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setLessThanSignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setLessThanSignedImmediate - false", () => {
    const firstValue = -1n;
    const secondValue = -2n;
    const resultValue = 0n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setLessThanSignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("setGreaterThanSignedImmediate - true", () => {
    const firstValue = -1n;
    const secondValue = -2n;
    const resultValue = 1n;
    const { bitOps, firstRegisterIndex, immediate, resultRegisterIndex, regs } = prepareData(firstValue, secondValue);

    bitOps.setGreaterThanSignedImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

```
