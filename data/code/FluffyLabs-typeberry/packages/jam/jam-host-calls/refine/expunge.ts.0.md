---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/expunge.ts#L1-L49
title: packages/jam/jam-host-calls/refine/expunge.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2a5fb0e85acb03d3d5d4278e1e4bd3e52475ecff2a88c0eb0c605c73f4aca0a3
language: typescript
---
`packages/jam/jam-host-calls/refine/expunge.ts` (lines 1–49)

```typescript
import {
  type HostCallHandler,
  type HostCallRegisters,
  type PvmExecution,
  traceRegisters,
  tryAsHostCallIndex,
} from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { resultToString } from "@typeberry/utils";
import { type RefineExternalities, tryAsMachineId } from "../externalities/refine-externalities.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";
import { CURRENT_SERVICE_ID } from "../utils.js";

const IN_OUT_REG = 7;

/**
 * Forget a previously started nested machine.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/358502358502?v=0.6.7
 */
export class Expunge implements HostCallHandler {
  index = tryAsHostCallIndex(13);
  basicGasCost = tryAsSmallGas(10);
  currentServiceId = CURRENT_SERVICE_ID;
  tracedRegisters = traceRegisters(IN_OUT_REG);

  static new(refine: RefineExternalities) {
    return new Expunge(refine);
  }

  private constructor(private readonly refine: RefineExternalities) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters): Promise<PvmExecution | undefined> {
    // `n`: machine index
    const machineIndex = tryAsMachineId(regs.get(IN_OUT_REG));

    const expungeResult = await this.refine.machineExpunge(machineIndex);
    logger.trace`[${this.currentServiceId}] EXPUNGE(${machineIndex}) <- ${resultToString(expungeResult)}`;

    if (expungeResult.isOk) {
      regs.set(IN_OUT_REG, expungeResult.ok);
    } else {
      regs.set(IN_OUT_REG, HostCallResult.WHO);
    }

    return;
  }
}
```
