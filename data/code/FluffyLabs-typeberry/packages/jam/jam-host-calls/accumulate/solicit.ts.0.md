---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/solicit.ts#L1-L68
title: packages/jam/jam-host-calls/accumulate/solicit.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 38e577a0a26e3121cc9e10f790025ba9c361e5176d64e0eabc5b192be1cf1b44
language: typescript
---
`packages/jam/jam-host-calls/accumulate/solicit.ts` (lines 1–68)

```typescript
import type { ServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { assertNever, resultToString } from "@typeberry/utils";
import { type PartialState, RequestPreimageError } from "../externalities/partial-state.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";

const IN_OUT_REG = 7;

/**
 * Request a preimage to be available.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/383b00383b00?v=0.6.7
 */
export class Solicit implements HostCallHandler {
  index = tryAsHostCallIndex(23);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8);

  static new(currentServiceId: ServiceId, partialState: PartialState) {
    return new Solicit(currentServiceId, partialState);
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
    if (memoryReadResult.isError) {
      logger.trace`[${this.currentServiceId}] SOLICIT(${hash}, ${length}) <- PANIC`;
      return PvmExecution.Panic;
    }

    const result = this.partialState.requestPreimage(hash.asOpaque(), length);
    logger.trace`[${this.currentServiceId}] SOLICIT(${hash}, ${length}) <- ${resultToString(result)}`;

    if (result.isOk) {
      regs.set(IN_OUT_REG, HostCallResult.OK);
      return;
    }

    const e = result.error;

    if (e === RequestPreimageError.AlreadyAvailable || e === RequestPreimageError.AlreadyRequested) {
      regs.set(IN_OUT_REG, HostCallResult.HUH);
      return;
    }

    if (e === RequestPreimageError.InsufficientFunds) {
      regs.set(IN_OUT_REG, HostCallResult.FULL);
      return;
    }

    assertNever(e);
  }
}
```
