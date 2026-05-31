---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/provide.ts#L1-L81
title: packages/jam/jam-host-calls/accumulate/provide.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 303857850b6508873737f8972b51a20d5b60ecf2bd20018667c273300e35e690
language: typescript
---
`packages/jam/jam-host-calls/accumulate/provide.ts` (lines 1–81)

```typescript
import type { ServiceId } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import {
  type HostCallHandler,
  type HostCallMemory,
  type HostCallRegisters,
  PvmExecution,
  traceRegisters,
  tryAsHostCallIndex,
} from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { assertNever, resultToString, safeAllocUint8Array } from "@typeberry/utils";
import { type PartialState, ProvidePreimageError } from "../externalities/partial-state.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";
import { clampU64ToU32, getServiceIdOrCurrent } from "../utils.js";

const IN_OUT_REG = 7;

/**
 * Provide a preimage for a given service.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/388e02388e02?v=0.6.7
 */
export class Provide implements HostCallHandler {
  index = tryAsHostCallIndex(26);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, 9);

  static new(currentServiceId: ServiceId, partialState: PartialState) {
    return new Provide(currentServiceId, partialState);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly partialState: PartialState,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory) {
    // `s`
    const serviceId = getServiceIdOrCurrent(IN_OUT_REG, regs, this.currentServiceId);

    // `o`
    const preimageStart = regs.get(8);
    // `z`
    const preimageLength = regs.get(9);

    const length = clampU64ToU32(preimageLength);

    // `i`
    const preimage = BytesBlob.blobFrom(safeAllocUint8Array(length));
    const memoryReadResult = memory.loadInto(preimage.raw, preimageStart);
    if (memoryReadResult.isError) {
      logger.trace`[${this.currentServiceId}] PROVIDE(${serviceId}, ${preimage.toStringTruncated()}) <- PANIC`;
      return PvmExecution.Panic;
    }

    const result = this.partialState.providePreimage(serviceId, preimage);
    logger.trace`[${this.currentServiceId}] PROVIDE(${serviceId}, ${preimage.toStringTruncated()}) <- ${resultToString(result)}`;
    logger.insane`[${this.currentServiceId}] PROVIDE(${serviceId}, ${preimage}) <- ${resultToString(result)}`;

    if (result.isOk) {
      regs.set(IN_OUT_REG, HostCallResult.OK);
      return;
    }

    const e = result.error;

    if (e === ProvidePreimageError.ServiceNotFound) {
      regs.set(IN_OUT_REG, HostCallResult.WHO);
      return;
    }

    if (e === ProvidePreimageError.WasNotRequested || e === ProvidePreimageError.AlreadyProvided) {
      regs.set(IN_OUT_REG, HostCallResult.HUH);
      return;
    }

    assertNever(e);
  }
}
```
