---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/dynamic-jump-ops.ts#L1-L60
title: packages/core/pvm-interpreter/ops/dynamic-jump-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 634f9dc86fe5e1bf434f1fac7b149ac9edeb22b1cfb8ad87c9a047acfa1a0730
language: typescript
---
`packages/core/pvm-interpreter/ops/dynamic-jump-ops.ts` (lines 1–60)

```typescript
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import type { BasicBlocks } from "../basic-blocks/index.js";
import type { InstructionResult } from "../instruction-result.js";
import type { JumpTable } from "../program-decoder/jump-table.js";
import type { Registers } from "../registers.js";
import { Result } from "../result.js";
import { addWithOverflowU32 } from "./math-utils.js";

const EXIT = 0xff_ff_00_00;
/** `Z_A`: https://graypaper.fluffylabs.dev/#/579bd12/248402248402 */
const JUMP_ALIGMENT_FACTOR = 2;

export class DynamicJumpOps {
  static new(regs: Registers, jumpTable: JumpTable, instructionResult: InstructionResult, basicBlocks: BasicBlocks) {
    return new DynamicJumpOps(regs, jumpTable, instructionResult, basicBlocks);
  }

  private constructor(
    private regs: Registers,
    private jumpTable: JumpTable,
    private instructionResult: InstructionResult,
    private basicBlocks: BasicBlocks,
  ) {}

  private djump(dynamicAddress: number) {
    if (dynamicAddress === EXIT) {
      this.instructionResult.status = Result.HALT;
      return;
    }

    if (dynamicAddress === 0 || dynamicAddress % JUMP_ALIGMENT_FACTOR !== 0) {
      this.instructionResult.status = Result.PANIC;
      return;
    }

    const jumpTableIndex = dynamicAddress / JUMP_ALIGMENT_FACTOR - 1;

    if (!this.jumpTable.hasIndex(jumpTableIndex)) {
      this.instructionResult.status = Result.PANIC;
      return;
    }
    const destination = this.jumpTable.getDestination(jumpTableIndex);

    if (!this.basicBlocks.isBeginningOfBasicBlock(destination)) {
      this.instructionResult.status = Result.PANIC;
      return;
    }

    this.instructionResult.nextPc = destination;
  }

  caluclateJumpAddress(immediate: ImmediateDecoder, registerIndex: number) {
    const registerValue = this.regs.getLowerU32(registerIndex);
    return addWithOverflowU32(registerValue, immediate.getU32());
  }

  jumpInd(address: number) {
    this.djump(address);
  }
}
```
