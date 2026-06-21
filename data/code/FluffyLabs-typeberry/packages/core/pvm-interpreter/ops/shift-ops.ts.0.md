---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.ts#L1-L90
title: packages/core/pvm-interpreter/ops/shift-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: 9bea9cae90f6cb1fd4747e2eb1d74b0bbe25efa21d04eeadd10e5c37b75e8cc4
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.ts` (lines 1–90)

```typescript
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import type { Registers } from "../registers.js";
import { MAX_SHIFT_U32, MAX_SHIFT_U64 } from "./math-consts.js";
import { unsignedRightShiftBigInt } from "./math-utils.js";

export class ShiftOps {
  static new(regs: Registers) {
    return new ShiftOps(regs);
  }

  private constructor(private regs: Registers) {}

  shiftLogicalLeftU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU32(
      resultIndex,
      this.regs.getLowerU32(firstIndex) << (this.regs.getLowerU32(secondIndex) % MAX_SHIFT_U32),
    );
  }

  shiftLogicalLeftU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) << (this.regs.getU64(secondIndex) % MAX_SHIFT_U64));
  }

  shiftLogicalRightU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU32(
      resultIndex,
      this.regs.getLowerU32(firstIndex) >>> (this.regs.getLowerU32(secondIndex) % MAX_SHIFT_U32),
    );
  }

  shiftLogicalRightU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      unsignedRightShiftBigInt(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex) % MAX_SHIFT_U64),
    );
  }

  shiftArithmeticRightU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI32(
      resultIndex,
      this.regs.getLowerI32(firstIndex) >> (this.regs.getLowerU32(secondIndex) % MAX_SHIFT_U32),
    );
  }

  shiftArithmeticRightU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI64(resultIndex, this.regs.getI64(firstIndex) >> (this.regs.getU64(secondIndex) % MAX_SHIFT_U64));
  }

  shiftLogicalLeftImmediateU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU32(resultIndex, this.regs.getLowerU32(firstIndex) << (immediate.getU32() % MAX_SHIFT_U32));
  }

  shiftLogicalLeftImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) << (immediate.getU64() % MAX_SHIFT_U64));
  }

  shiftLogicalRightImmediateU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU32(resultIndex, this.regs.getLowerU32(firstIndex) >>> (immediate.getU32() % MAX_SHIFT_U32));
  }

  shiftLogicalRightImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      unsignedRightShiftBigInt(this.regs.getU64(firstIndex), immediate.getU64() % MAX_SHIFT_U64),
    );
  }

  shiftArithmeticRightImmediateU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU32(resultIndex, this.regs.getLowerI32(firstIndex) >> (immediate.getU32() % MAX_SHIFT_U32));
  }

  shiftArithmeticRightImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getI64(firstIndex) >> (immediate.getU64() % MAX_SHIFT_U64));
  }

  shiftLogicalLeftImmediateAlternativeU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU32(resultIndex, immediate.getU32() << (this.regs.getLowerU32(firstIndex) % MAX_SHIFT_U32));
  }

  shiftLogicalLeftImmediateAlternativeU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, immediate.getU64() << (this.regs.getU64(firstIndex) % MAX_SHIFT_U64));
  }

  shiftLogicalRightImmediateAlternativeU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU32(resultIndex, immediate.getU32() >>> (this.regs.getLowerU32(firstIndex) % MAX_SHIFT_U32));
  }

  shiftLogicalRightImmediateAlternativeU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
```
