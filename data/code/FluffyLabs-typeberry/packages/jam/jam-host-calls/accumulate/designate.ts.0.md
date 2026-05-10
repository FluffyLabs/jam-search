---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/designate.ts#L1-L61
title: packages/jam/jam-host-calls/accumulate/designate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 8aa1b8ad1a0c7ff294f6aafe2f9330617013940ec8bd9374d00b3c969f0a63a5
language: typescript
---
`packages/jam/jam-host-calls/accumulate/designate.ts` (lines 1–61)

```typescript
import { type ServiceId, tryAsPerValidator } from "@typeberry/block";
import { Decoder, tryAsExactBytes } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { ValidatorData } from "@typeberry/state";
import { safeAllocUint8Array } from "@typeberry/utils";
import type { PartialState } from "../externalities/partial-state.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";

const IN_OUT_REG = 7;
export const VALIDATOR_DATA_BYTES = tryAsExactBytes(ValidatorData.Codec.sizeHint);

/**
 * Designate a new set of validator keys.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/36b50136b501?v=0.6.7
 */
export class Designate implements HostCallHandler {
  index = tryAsHostCallIndex(16);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG);

  static new(currentServiceId: ServiceId, partialState: PartialState, chainSpec: ChainSpec) {
    return new Designate(currentServiceId, partialState, chainSpec);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly partialState: PartialState,
    private readonly chainSpec: ChainSpec,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<undefined | PvmExecution> {
    // `o`
    const validatorsStart = regs.get(IN_OUT_REG);

    const res = safeAllocUint8Array(VALIDATOR_DATA_BYTES * this.chainSpec.validatorsCount);
    const memoryReadResult = memory.loadInto(res, validatorsStart);
    // error while reading the memory.
    if (memoryReadResult.isError) {
      logger.trace`[${this.currentServiceId}] DESIGNATE() <- PANIC`;
      return PvmExecution.Panic;
    }

    const decoder = Decoder.fromBlob(res);
    const validatorsData = decoder.sequenceFixLen(ValidatorData.Codec, this.chainSpec.validatorsCount);

    const result = this.partialState.updateValidatorsData(tryAsPerValidator(validatorsData, this.chainSpec));

    if (result.isError) {
      logger.trace`[${this.currentServiceId}] DESIGNATE([${validatorsData[0]}, ${validatorsData[1]}, ...]) <- HUH`;
      regs.set(IN_OUT_REG, HostCallResult.HUH);
    } else {
      logger.trace`[${this.currentServiceId}] DESIGNATE([${validatorsData[0]}, ${validatorsData[1]}, ...]) <- OK`;
      regs.set(IN_OUT_REG, HostCallResult.OK);
    }
  }
}
```
