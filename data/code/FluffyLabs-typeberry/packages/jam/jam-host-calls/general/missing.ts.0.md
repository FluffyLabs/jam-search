---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/missing.ts#L1-L23
title: packages/jam/jam-host-calls/general/missing.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 397ada17d4264cf4feb44e35a2f9e2bbc971fb7083f85204062ac281b6622e84
language: typescript
---
`packages/jam/jam-host-calls/general/missing.ts` (lines 1–23)

```typescript
import {
  type HostCallHandler,
  type HostCallMemory,
  type HostCallRegisters,
  type PvmExecution,
  traceRegisters,
  tryAsHostCallIndex,
} from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { CURRENT_SERVICE_ID } from "../utils.js";
import { HostCallResult } from "./results.js";

export class Missing implements HostCallHandler {
  index = tryAsHostCallIndex(2 ** 32 - 1);
  basicGasCost = tryAsSmallGas(10);
  currentServiceId = CURRENT_SERVICE_ID;
  tracedRegisters = traceRegisters(7);

  execute(_gas: IGasCounter, regs: HostCallRegisters, _memory: HostCallMemory): Promise<PvmExecution | undefined> {
    regs.set(7, HostCallResult.WHAT);
    return Promise.resolve(undefined);
  }
}
```
