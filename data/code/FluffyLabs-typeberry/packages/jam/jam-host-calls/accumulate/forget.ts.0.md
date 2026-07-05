---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/forget.ts#L1-L56
title: packages/jam/jam-host-calls/accumulate/forget.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ec2baab88a3e7cf1e606a31450b8c6362940ab4f08ba6342aaef8a1e965d9f82
language: typescript
---
`packages/jam/jam-host-calls/accumulate/forget.ts` (lines 1–56)

```typescript
import type { ServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { resultToString } from "@typeberry/utils";
import type { PartialState } from "../externalities/partial-state.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";

const IN_OUT_REG = 7;

/**
 * Delete preimage hash or mark as unavailable if it was available.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/385d01385d01?v=0.7.2
 */
export class Forget implements HostCallHandler {
  index = tryAsHostCallIndex(24);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8);

  static new(currentServiceId: ServiceId, partialState: PartialState) {
    return new Forget(currentServiceId, partialState);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly partialState: PartialState,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<PvmExecution | undefined> {
    // `o`
    const hashStart = regs.get(IN_OUT_REG);
    // `z`
    const length = regs.get(8);

    const hash = Bytes.zero(HASH_SIZE);
    const memoryReadResult = memory.loadInto(hash.raw, hashStart);
    // error while reading the memory.
    if (memoryReadResult.isError) {
      logger.trace`[${this.currentServiceId}] FORGET(${hash}, ${length}) <- PANIC`;
      return PvmExecution.Panic;
    }

    const result = this.partialState.forgetPreimage(hash.asOpaque(), length);
    logger.trace`[${this.currentServiceId}] FORGET(${hash}, ${length}) <- ${resultToString(result)}`;

    if (result.isOk) {
      regs.set(IN_OUT_REG, HostCallResult.OK);
    } else {
      regs.set(IN_OUT_REG, HostCallResult.HUH);
    }
  }
}
```
