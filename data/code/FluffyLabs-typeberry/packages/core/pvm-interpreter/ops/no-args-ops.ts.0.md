---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/no-args-ops.ts#L1-L18
title: packages/core/pvm-interpreter/ops/no-args-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b090a668360fe5be42065df9de66ed59e94e077806576b9b34b9f260f8bfc984
language: typescript
---
`packages/core/pvm-interpreter/ops/no-args-ops.ts` (lines 1–18)

```typescript
import type { InstructionResult } from "../instruction-result.js";
import { Result } from "../result.js";

export class NoArgsOps {
  static new(instructionResult: InstructionResult) {
    return new NoArgsOps(instructionResult);
  }

  private constructor(private instructionResult: InstructionResult) {}

  trap() {
    this.instructionResult.status = Result.PANIC;
  }

  fallthrough() {
    // noop
  }
}
```
