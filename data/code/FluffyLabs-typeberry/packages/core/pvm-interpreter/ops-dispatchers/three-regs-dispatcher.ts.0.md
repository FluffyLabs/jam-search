---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.ts#L1-L97
title: packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 211dcb479b0d7f36d4e097b8ab29a261301a86002b5cc039b8485f32b1427cc6
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.ts` (lines 1–97)

```typescript
import type { ThreeRegistersArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { BitOps, BitRotationOps, BooleanOps, MathOps, MoveOps, ShiftOps } from "../ops/index.js";

export class ThreeRegsDispatcher {
  constructor(
    private mathOps: MathOps,
    private shiftOps: ShiftOps,
    private bitOps: BitOps,
    private booleanOps: BooleanOps,
    private moveOps: MoveOps,
    private bitRotationOps: BitRotationOps,
  ) {}

  dispatch(instruction: Instruction, args: ThreeRegistersArgs) {
    switch (instruction) {
      case Instruction.ADD_32:
        this.mathOps.addU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.ADD_64:
        this.mathOps.addU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MUL_32:
        this.mathOps.mulU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MUL_64:
        this.mathOps.mulU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MUL_UPPER_U_U:
        this.mathOps.mulUpperUU(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MUL_UPPER_S_S:
        this.mathOps.mulUpperSS(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MUL_UPPER_S_U:
        this.mathOps.mulUpperSU(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SUB_32:
        this.mathOps.subU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SUB_64:
        this.mathOps.subU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.DIV_S_32:
        this.mathOps.divSignedU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;
      case Instruction.DIV_S_64:
        this.mathOps.divSignedU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.DIV_U_32:
        this.mathOps.divUnsignedU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;
      case Instruction.DIV_U_64:
        this.mathOps.divUnsignedU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.REM_S_32:
        this.mathOps.remSignedU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;
      case Instruction.REM_S_64:
        this.mathOps.remSignedU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.REM_U_32:
        this.mathOps.remUnsignedU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;
      case Instruction.REM_U_64:
        this.mathOps.remUnsignedU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SHLO_L_32:
        this.shiftOps.shiftLogicalLeftU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SHLO_L_64:
        this.shiftOps.shiftLogicalLeftU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SHLO_R_32:
        this.shiftOps.shiftLogicalRightU32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SHLO_R_64:
        this.shiftOps.shiftLogicalRightU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SHAR_R_32:
```
