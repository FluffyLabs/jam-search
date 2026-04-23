---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/host-call-ops.ts#L1-L16
title: packages/core/pvm-interpreter/ops/host-call-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: fc4d1d97a10e7c12e1dac6444b7f75cfc46d0cb343302fb3034baf2752f83b65
language: typescript
---
`packages/core/pvm-interpreter/ops/host-call-ops.ts` (lines 1–16)

```typescript
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import type { InstructionResult } from "../instruction-result.js";
import { Result } from "../result.js";

export class HostCallOps {
  static new(instructionResult: InstructionResult) {
    return new HostCallOps(instructionResult);
  }

  private constructor(private instructionResult: InstructionResult) {}

  hostCall(immediateDecoder: ImmediateDecoder) {
    this.instructionResult.status = Result.HOST;
    this.instructionResult.exitParam = immediateDecoder.getUnsigned();
  }
}
```
