---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.ts#L1-L49
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 99af9f61915155858d52424a00d50abc621e201dd93b6db9f97bdf7b9cd6fb84
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.ts` (lines 1–49)

```typescript
import type { OneRegisterOneImmediateOneOffsetArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { BranchOps, LoadOps } from "../ops/index.js";

export class OneRegOneImmOneOffsetDispatcher {
  constructor(
    private branchOps: BranchOps,
    private loadOps: LoadOps,
  ) {}

  dispatch(instruction: Instruction, args: OneRegisterOneImmediateOneOffsetArgs) {
    switch (instruction) {
      case Instruction.LOAD_IMM_JUMP:
        this.loadOps.loadImmediate(args.registerIndex, args.immediateDecoder);
        this.branchOps.jump(args.nextPc);
        break;
      case Instruction.BRANCH_EQ_IMM:
        this.branchOps.branchEqImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_NE_IMM:
        this.branchOps.branchNeImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_LT_U_IMM:
        this.branchOps.branchLtUnsignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_LE_U_IMM:
        this.branchOps.branchLeUnsignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_GE_U_IMM:
        this.branchOps.branchGeUnsignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_GT_U_IMM:
        this.branchOps.branchGtUnsignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_LT_S_IMM:
        this.branchOps.branchLtSignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_LE_S_IMM:
        this.branchOps.branchLeSignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_GE_S_IMM:
        this.branchOps.branchGeSignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
      case Instruction.BRANCH_GT_S_IMM:
        this.branchOps.branchGtSignedImmediate(args.registerIndex, args.immediateDecoder, args.nextPc);
        break;
    }
  }
}
```
