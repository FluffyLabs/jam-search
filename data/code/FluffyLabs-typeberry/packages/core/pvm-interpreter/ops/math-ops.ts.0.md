---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.ts#L1-L103
title: packages/core/pvm-interpreter/ops/math-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: 6756e65d4eafb6bd80c75082f75142a244f3bb6149ec6741d4fd3cacefc769a6
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.ts` (lines 1–103)

```typescript
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { type Registers, signExtend32To64 } from "../registers.js";
import { MIN_VALUE_I32 } from "./math-consts.js";
import {
  addWithOverflowU32,
  addWithOverflowU64,
  maxBigInt,
  minBigInt,
  mulLowerUnsignedU32,
  mulU64,
  mulUpperSS,
  mulUpperSU,
  mulUpperUU,
  subU32,
  subU64,
} from "./math-utils.js";

export class MathOps {
  static new(regs: Registers) {
    return new MathOps(regs);
  }

  private constructor(private regs: Registers) {}

  addU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      signExtend32To64(addWithOverflowU32(this.regs.getLowerU32(firstIndex), this.regs.getLowerU32(secondIndex))),
    );
  }

  addU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, addWithOverflowU64(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex)));
  }

  addImmediateU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      signExtend32To64(addWithOverflowU32(this.regs.getLowerU32(firstIndex), immediate.getU32())),
    );
  }

  addImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, addWithOverflowU64(this.regs.getU64(firstIndex), immediate.getU64()));
  }

  mulU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      signExtend32To64(mulLowerUnsignedU32(this.regs.getLowerU32(firstIndex), this.regs.getLowerU32(secondIndex))),
    );
  }

  mulU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, mulU64(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex)));
  }

  mulUpperUU(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, mulUpperUU(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex)));
  }

  mulUpperSS(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI64(resultIndex, mulUpperSS(this.regs.getI64(firstIndex), this.regs.getI64(secondIndex)));
  }

  mulUpperSU(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI64(resultIndex, mulUpperSU(this.regs.getI64(firstIndex), this.regs.getU64(secondIndex)));
  }

  mulImmediateU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      signExtend32To64(mulLowerUnsignedU32(this.regs.getLowerU32(firstIndex), immediate.getU32())),
    );
  }

  mulImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, mulU64(this.regs.getU64(firstIndex), immediate.getU64()));
  }

  mulUpperSSImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setI64(resultIndex, mulUpperSS(this.regs.getI64(firstIndex), immediate.getI64()));
  }

  mulUpperUUImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, mulUpperUU(this.regs.getU64(firstIndex), immediate.getU64()));
  }

  subU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      signExtend32To64(subU32(this.regs.getLowerU32(firstIndex), this.regs.getLowerU32(secondIndex))),
    );
  }
  subU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, subU64(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex)));
  }

  negAddImmediateU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, signExtend32To64(subU32(immediate.getU32(), this.regs.getLowerU32(firstIndex))));
  }

  negAddImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
```
