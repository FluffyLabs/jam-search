---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/move-ops.test.ts#L1-L117
title: packages/core/pvm-interpreter/ops/move-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 02046f9021bdf1ff10fdace1b80b9e78a96408338cef721d4c57f18c7430c2ba
language: typescript
---
`packages/core/pvm-interpreter/ops/move-ops.test.ts` (lines 1–117)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { MoveOps } from "./move-ops.js";

describe("MoveOps", () => {
  function prepareData(firstValue: bigint, secondValue: bigint) {
    const regs = Registers.empty();
    const firstRegisterIndex = 0;
    const secondRegisterIndex = 1;
    const resultRegisterIndex = 12;

    regs.setU64(firstRegisterIndex, firstValue);
    regs.setU64(secondRegisterIndex, secondValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    const moveOps = MoveOps.new(regs);

    return { regs, moveOps, immediate, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex };
  }

  it("moveRegister", () => {
    const firstValue = 5n;
    const resultValue = firstValue;
    const { moveOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(firstValue, 0n);

    moveOps.moveRegister(firstRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("moveRegister u64", () => {
    const firstValue = 0x7fff_ffff_ffff_ffffn;
    const resultValue = firstValue;
    const { moveOps, regs, firstRegisterIndex, resultRegisterIndex } = prepareData(firstValue, 0n);

    assert.strictEqual(regs.getU64(resultRegisterIndex), 0n);

    moveOps.moveRegister(firstRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfZero (condition satisfied)", () => {
    const firstValue = 5n;
    const secondValue = 0n;
    const resultValue = firstValue;
    const { moveOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    moveOps.cmovIfZero(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfZero (condition not satisfied)", () => {
    const firstValue = 5n;
    const secondValue = 3n;
    const resultValue = 0n;
    const { moveOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    moveOps.cmovIfZero(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfNotZero (condition satisfied)", () => {
    const firstValue = 5n;
    const secondValue = 3n;
    const resultValue = 5n;
    const { moveOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    moveOps.cmovIfNotZero(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfNotZero (condition not satisfied)", () => {
    const firstValue = 5n;
    const secondValue = 0n;
    const resultValue = 0n;
    const { moveOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    moveOps.cmovIfNotZero(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfZeroImmediate (condition satisfied)", () => {
    const firstValue = 0n;
    const secondValue = 5n;
    const resultValue = secondValue;
    const { moveOps, regs, firstRegisterIndex, immediate, resultRegisterIndex } = prepareData(firstValue, secondValue);

    moveOps.cmovIfZeroImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("cmovIfZeroImmediate (condition not satisfied)", () => {
    const firstValue = 3n;
```
