---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts#L1-L131
title: packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 3
content_sha: e846619bdaf017112f70fe8e3183473d5cb2c4cf7b49ff717a811cceedf70c78
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts` (lines 1–131)

```typescript
import type { TwoRegistersOneImmediateArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type {
  BitOps,
  BitRotationOps,
  BooleanOps,
  LoadOps,
  MathOps,
  MoveOps,
  ShiftOps,
  StoreOps,
} from "../ops/index.js";

export class TwoRegsOneImmDispatcher {
  constructor(
    private mathOps: MathOps,
    private shiftOps: ShiftOps,
    private bitOps: BitOps,
    private booleanOps: BooleanOps,
    private moveOps: MoveOps,
    private storeOps: StoreOps,
    private loadOps: LoadOps,
    private bitRotationOps: BitRotationOps,
  ) {}

  dispatch(instruction: Instruction, args: TwoRegistersOneImmediateArgs) {
    switch (instruction) {
      case Instruction.ADD_IMM_32:
        this.mathOps.addImmediateU32(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.ADD_IMM_64:
        this.mathOps.addImmediateU64(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.MUL_IMM_32:
        this.mathOps.mulImmediateU32(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.MUL_IMM_64:
        this.mathOps.mulImmediateU64(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.NEG_ADD_IMM_32:
        this.mathOps.negAddImmediateU32(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.NEG_ADD_IMM_64:
        this.mathOps.negAddImmediateU64(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.SHLO_L_IMM_32:
        this.shiftOps.shiftLogicalLeftImmediateU32(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_L_IMM_64:
        this.shiftOps.shiftLogicalLeftImmediateU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_L_IMM_ALT_32:
        this.shiftOps.shiftLogicalLeftImmediateAlternativeU32(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_L_IMM_ALT_64:
        this.shiftOps.shiftLogicalLeftImmediateAlternativeU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_R_IMM_32:
        this.shiftOps.shiftLogicalRightImmediateU32(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_R_IMM_64:
        this.shiftOps.shiftLogicalRightImmediateU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_R_IMM_ALT_32:
        this.shiftOps.shiftLogicalRightImmediateAlternativeU32(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHLO_R_IMM_ALT_64:
        this.shiftOps.shiftLogicalRightImmediateAlternativeU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHAR_R_IMM_32:
        this.shiftOps.shiftArithmeticRightImmediateU32(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHAR_R_IMM_64:
        this.shiftOps.shiftArithmeticRightImmediateU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

```
