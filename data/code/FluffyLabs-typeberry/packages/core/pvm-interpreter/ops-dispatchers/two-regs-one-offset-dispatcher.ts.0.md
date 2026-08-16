---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-offset-dispatcher.ts#L1-L30
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-offset-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3b75b91251762aa9ae10ee5019e86517a9a1cd0c1b682eef798c9ce402c025d6
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-offset-dispatcher.ts` (lines 1–30)

```typescript
import type { TwoRegistersOneOffsetArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { BranchOps } from "../ops/index.js";

export class TwoRegsOneOffsetDispatcher {
  constructor(private branchOps: BranchOps) {}

  dispatch(instruction: Instruction, args: TwoRegistersOneOffsetArgs) {
    switch (instruction) {
      case Instruction.BRANCH_EQ:
        this.branchOps.branchEq(args.firstRegisterIndex, args.secondRegisterIndex, args.nextPc);
        break;
      case Instruction.BRANCH_NE:
        this.branchOps.branchNe(args.firstRegisterIndex, args.secondRegisterIndex, args.nextPc);
        break;
      case Instruction.BRANCH_LT_U:
        this.branchOps.branchLtUnsigned(args.firstRegisterIndex, args.secondRegisterIndex, args.nextPc);
        break;
      case Instruction.BRANCH_LT_S:
        this.branchOps.branchLtSigned(args.firstRegisterIndex, args.secondRegisterIndex, args.nextPc);
        break;
      case Instruction.BRANCH_GE_U:
        this.branchOps.branchGeUnsigned(args.firstRegisterIndex, args.secondRegisterIndex, args.nextPc);
        break;
      case Instruction.BRANCH_GE_S:
        this.branchOps.branchGeSigned(args.firstRegisterIndex, args.secondRegisterIndex, args.nextPc);
        break;
    }
  }
}
```
