---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.ts#L1-L157
title: packages/core/pvm-interpreter/args-decoder/args-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 58bf9dc79d864d5663d6fa0c0231f167a32ea3a91dd445745ca0ddfae5ad583b
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.ts` (lines 1–157)

```typescript
import { Mask } from "../program-decoder/mask.js";
import { ArgumentType } from "./argument-type.js";
import type { ExtendedWitdthImmediateDecoder } from "./decoders/extended-with-immediate-decoder.js";
import { ImmediateDecoder } from "./decoders/immediate-decoder.js";
import { NibblesDecoder } from "./decoders/nibbles-decoder.js";

const IMMEDIATE_AND_OFFSET_MAX_LENGTH = 4;

export type EmptyArgs = {
  type: ArgumentType.NO_ARGUMENTS;
  noOfBytesToSkip: number;
};

export type OneImmediateArgs = {
  type: ArgumentType.ONE_IMMEDIATE;
  noOfBytesToSkip: number;
  /** V_X */
  immediateDecoder: ImmediateDecoder;
};

export type ThreeRegistersArgs = {
  type: ArgumentType.THREE_REGISTERS;
  noOfBytesToSkip: number;
  /** W_A */
  firstRegisterIndex: number;
  /** W_B */
  secondRegisterIndex: number;
  /** W_D */
  thirdRegisterIndex: number;
};

export type TwoRegistersArgs = {
  type: ArgumentType.TWO_REGISTERS;
  noOfBytesToSkip: number;
  /** W_A */
  firstRegisterIndex: number;
  /** W_D */
  secondRegisterIndex: number;
};

export type TwoRegistersOneImmediateArgs = {
  type: ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  noOfBytesToSkip: number;
  /** W_A */
  firstRegisterIndex: number;
  /** W_B */
  secondRegisterIndex: number;
  /** V_X */
  immediateDecoder: ImmediateDecoder;
};

export type OneRegisterOneImmediateArgs = {
  type: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  noOfBytesToSkip: number;
  /** W_A */
  registerIndex: number;
  /** V_X */
  immediateDecoder: ImmediateDecoder;
};

export type OneRegisterOneExtendedWidthImmediateArgs = {
  type: ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE;
  noOfBytesToSkip: number;
  /** W_A */
  registerIndex: number;
  /** V_X */
  immediateDecoder: ExtendedWitdthImmediateDecoder;
};

export type TwoRegistersTwoImmediatesArgs = {
  type: ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES;
  noOfBytesToSkip: number;
  /** W_A */
  firstRegisterIndex: number;
  /** W_B */
  secondRegisterIndex: number;
  /** V_X */
  firstImmediateDecoder: ImmediateDecoder;
  /** V_Y */
  secondImmediateDecoder: ImmediateDecoder;
};

export type TwoImmediatesArgs = {
  type: ArgumentType.TWO_IMMEDIATES;
  noOfBytesToSkip: number;
  /** V_X */
  firstImmediateDecoder: ImmediateDecoder;
  /** V_Y */
  secondImmediateDecoder: ImmediateDecoder;
};

export type TwoRegistersOneOffsetArgs = {
  type: ArgumentType.TWO_REGISTERS_ONE_OFFSET;
  noOfBytesToSkip: number;
  /** W_A */
  firstRegisterIndex: number;
  /** W_B */
  secondRegisterIndex: number;
  nextPc: number;
};

export type OneRegisterOneImmediateOneOffsetArgs = {
  type: ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  noOfBytesToSkip: number;
  /** W_A */
  registerIndex: number;
  /** V_X */
  immediateDecoder: ImmediateDecoder;
  /** V_Y */
  nextPc: number;
};

export type OneRegisterTwoImmediatesArgs = {
  type: ArgumentType.ONE_REGISTER_TWO_IMMEDIATES;
  noOfBytesToSkip: number;
  /** W_A */
  registerIndex: number;
  /** V_X */
  firstImmediateDecoder: ImmediateDecoder;
  /** V_Y */
  secondImmediateDecoder: ImmediateDecoder;
};

export type OneOffsetArgs = {
  type: ArgumentType.ONE_OFFSET;
  noOfBytesToSkip: number;
  /** V_X */
  nextPc: number;
};

export type Args =
  | EmptyArgs
  | OneImmediateArgs
  | TwoRegistersArgs
  | ThreeRegistersArgs
  | TwoRegistersOneImmediateArgs
  | TwoRegistersTwoImmediatesArgs
  | OneRegisterOneImmediateOneOffsetArgs
  | TwoRegistersOneOffsetArgs
  | OneRegisterOneImmediateArgs
  | OneOffsetArgs
  | TwoImmediatesArgs
  | OneRegisterTwoImmediatesArgs
  | OneRegisterOneExtendedWidthImmediateArgs;

export class ArgsDecoder {
  private nibblesDecoder = new NibblesDecoder();
  private offsetDecoder = ImmediateDecoder.new();
  private code: Uint8Array = new Uint8Array();
  private mask: Mask = Mask.empty();

  reset(code: Uint8Array, mask: Mask) {
    this.code = code;
    this.mask = mask;
  }

  fillArgs<T extends Args>(pc: number, result: T): void {
```
