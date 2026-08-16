---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/memory-ops.ts#L1-L24
title: packages/core/pvm-interpreter/ops/memory-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6cdcf2c76d15200ac370c4f1af82595ec5cdc161f67e1910d4129fe6064677ba
language: typescript
---
`packages/core/pvm-interpreter/ops/memory-ops.ts` (lines 1–24)

```typescript
import type { InstructionResult } from "../instruction-result.js";
import type { Memory } from "../memory/index.js";
import type { Registers } from "../registers.js";
import { Result } from "../result.js";

export class MemoryOps {
  static new(regs: Registers, memory: Memory, instructionResult: InstructionResult) {
    return new MemoryOps(regs, memory, instructionResult);
  }

  private constructor(
    private regs: Registers,
    private memory: Memory,
    private instructionResult: InstructionResult,
  ) {}

  sbrk(firstIndex: number, resultIndex: number) {
    try {
      this.regs.setU32(resultIndex, this.memory.sbrk(this.regs.getLowerU32(firstIndex)));
    } catch {
      this.instructionResult.status = Result.FAULT;
    }
  }
}
```
