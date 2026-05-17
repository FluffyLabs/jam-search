---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-ops.test.ts#L1-L119
title: packages/core/pvm-interpreter/ops/bit-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 4
content_sha: 94ade1a0c74227a9c468c26d16d21fff003282da6fd5cfa723a1d5b947ac4946
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-ops.test.ts` (lines 1–119)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { Registers } from "../registers.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { BitOps } from "./bit-ops.js";

describe("BitOps", () => {
  function prepareData(firstValue: bigint, secondValue = 0n) {
    const regs = Registers.empty();
    const firstRegisterIndex = 0;
    const secondRegisterIndex = 1;
    const resultRegisterIndex = 12;

    regs.setU64(firstRegisterIndex, firstValue);
    regs.setU64(secondRegisterIndex, secondValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(secondValue));

    const bitOps = BitOps.new(regs);

    return { regs, bitOps, immediate, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex };
  }

  it("or", () => {
    const firstValue = 0b01n;
    const secondValue = 0b10n;
    const resultValue = 0b11n;
    const { bitOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.or(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("orImmediate", () => {
    const firstValue = 0b01n;
    const secondValue = 0b10n;
    const resultValue = 0b11n;
    const { bitOps, regs, immediate, firstRegisterIndex, resultRegisterIndex } = prepareData(firstValue, secondValue);

    bitOps.orImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("and", () => {
    const firstValue = 0b101n;
    const secondValue = 0b011n;
    const resultValue = 0b001n;
    const { bitOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.and(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("andImmediate", () => {
    const firstValue = 0b101n;
    const secondValue = 0b011n;
    const resultValue = 0b001n;
    const { bitOps, regs, immediate, firstRegisterIndex, resultRegisterIndex } = prepareData(firstValue, secondValue);

    bitOps.andImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("xor", () => {
    const firstValue = 0b101n;
    const secondValue = 0b110n;
    const resultValue = 0b011n;
    const { bitOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.xor(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("xorImmediate", () => {
    const firstValue = 0b101n;
    const secondValue = 0b110n;
    const resultValue = 0b011n;
    const { bitOps, regs, immediate, firstRegisterIndex, resultRegisterIndex } = prepareData(firstValue, secondValue);

    bitOps.xorImmediate(firstRegisterIndex, immediate, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("andInv", () => {
    const firstValue = 0b011n;
    const secondValue = 0b101n;
    const resultValue = 0b010n;
    const { bitOps, regs, firstRegisterIndex, secondRegisterIndex, resultRegisterIndex } = prepareData(
      firstValue,
      secondValue,
    );

    bitOps.andInv(firstRegisterIndex, secondRegisterIndex, resultRegisterIndex);

    assert.strictEqual(regs.getU64(resultRegisterIndex), resultValue);
  });

  it("orInv", () => {
    const firstValue = 0b10n;
    const secondValue = 0b01n;
    const resultValue = 0xff_ff_ff_ff_ff_ff_ff_fen;
```
