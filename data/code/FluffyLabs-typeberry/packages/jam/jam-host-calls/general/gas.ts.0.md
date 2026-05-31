---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/gas.ts#L1-L32
title: packages/jam/jam-host-calls/general/gas.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 308b96de009c55d10e838cc6c7001dafbe484508b10ee17bc559d4ccad3ac72e
language: typescript
---
`packages/jam/jam-host-calls/general/gas.ts` (lines 1–32)

```typescript
import type { ServiceId } from "@typeberry/block";
import { tryAsU64 } from "@typeberry/numbers";
import type { HostCallHandler, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { type PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { logger } from "../logger.js";

/**
 * Return remaining gas to the PVM.
 *
 * NOTE it should be the gas left is AFTER this function is invoked.
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/311301311301?v=0.6.6
 */
export class GasHostCall implements HostCallHandler {
  index = tryAsHostCallIndex(0);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(7);

  static new(currentServiceId: ServiceId) {
    return new GasHostCall(currentServiceId);
  }

  private constructor(public readonly currentServiceId: ServiceId) {}

  execute(gas: IGasCounter, regs: HostCallRegisters): Promise<undefined | PvmExecution> {
    const gasValue = gas.get();
    logger.trace`[${this.currentServiceId}] GAS <- ${gasValue}`;
    regs.set(7, tryAsU64(gasValue));
    return Promise.resolve(undefined);
  }
}
```
