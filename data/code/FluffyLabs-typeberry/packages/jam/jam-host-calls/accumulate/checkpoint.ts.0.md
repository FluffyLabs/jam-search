---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/checkpoint.ts#L1-L40
title: packages/jam/jam-host-calls/accumulate/checkpoint.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f296245f568a961f155e96f57ae74dd6c173577718b463baaa8ede66cad771db
language: typescript
---
`packages/jam/jam-host-calls/accumulate/checkpoint.ts` (lines 1–40)

```typescript
import type { ServiceId } from "@typeberry/block";
import type { HostCallHandler, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { type PvmExecution, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import type { RegisterIndex } from "@typeberry/pvm-interpreter/registers.js";
import type { PartialState } from "../externalities/partial-state.js";
import { GasHostCall } from "../general/gas.js";
import { logger } from "../logger.js";

/**
 * Checkpoint the partial state.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/364402364402?v=0.6.7
 */
export class Checkpoint implements HostCallHandler {
  index = tryAsHostCallIndex(17);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters: RegisterIndex[];

  private readonly gasHostCall: GasHostCall;

  static new(currentServiceId: ServiceId, partialState: PartialState) {
    return new Checkpoint(currentServiceId, partialState);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly partialState: PartialState,
  ) {
    this.gasHostCall = GasHostCall.new(currentServiceId);
    this.tracedRegisters = this.gasHostCall.tracedRegisters;
  }

  async execute(gas: IGasCounter, regs: HostCallRegisters): Promise<undefined | PvmExecution> {
    await this.gasHostCall.execute(gas, regs);
    this.partialState.checkpoint();
    logger.trace`[${this.currentServiceId}] CHECKPOINT()`;
    return;
  }
}
```
