---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/instruction-result.ts#L1-L23
title: packages/core/pvm-interpreter/instruction-result.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 74ce6c1302400161121c01500c8900c1ccc69c1cf82716d76d00e99f441a2150
language: typescript
---
`packages/core/pvm-interpreter/instruction-result.ts` (lines 1–23)

```typescript
import type { Result } from "./result.js";

export class InstructionResult {
  public nextPc = 0;
  public status: Result | null = null;
  /**
   * A numeric exit parameter of the PVM.
   *
   * In case of a `status === Result.FAULT` this will be the memory address
   * that triggered the fault.
   * In case of a `status === Result.HOST` this will be the host call index
   * that should be invoked.
   *
   * In any other circumstance the value should be `null`.
   */
  public exitParam: number | null = null;

  reset() {
    this.nextPc = 0;
    this.status = null;
    this.exitParam = null;
  }
}
```
