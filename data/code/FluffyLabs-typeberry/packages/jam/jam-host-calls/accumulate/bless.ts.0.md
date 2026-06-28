---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/bless.ts#L1-L88
title: packages/jam/jam-host-calls/accumulate/bless.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: 4938a794e5ddfc025a9171c7a5b5a85e1243798c42e6a5c9a1a2176426d8eaf4
language: typescript
---
`packages/jam/jam-host-calls/accumulate/bless.ts` (lines 1–88)

```typescript
import { type ServiceGas, type ServiceId, tryAsServiceGas } from "@typeberry/block";
import { codec, Decoder, tryAsExactBytes } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import { tryAsU64 } from "@typeberry/numbers";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { tryAsPerCore } from "@typeberry/state";
import { asOpaqueType, assertNever, lazyInspect, safeAllocUint8Array } from "@typeberry/utils";
import { type PartialState, UpdatePrivilegesError } from "../externalities/partial-state.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";
import { getServiceId } from "../utils.js";

const IN_OUT_REG = 7;

const serviceIdAndGasCodec = codec.object({
  serviceId: codec.u32.convert<ServiceId>(
    (i) => i,
    (o) => asOpaqueType(o),
  ),
  gas: codec.u64.convert<ServiceGas>(
    (i) => tryAsU64(i),
    (o) => tryAsServiceGas(o),
  ),
});

/**
 * Modify privileged services and services that auto-accumulate every block.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/363b00363b00?v=0.6.7
 */
export class Bless implements HostCallHandler {
  index = tryAsHostCallIndex(14);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, 9, 10, 11, 12);

  static new(currentServiceId: ServiceId, partialState: PartialState, chainSpec: ChainSpec) {
    return new Bless(currentServiceId, partialState, chainSpec);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly partialState: PartialState,
    private readonly chainSpec: ChainSpec,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<undefined | PvmExecution> {
    // `m`: manager service (can change privileged services)
    const manager = getServiceId(regs.get(IN_OUT_REG));
    // `a`: mem pointer for collection of auth queue assigners (one per core)
    const assignersPtr = regs.get(8);
    // `v`: manages validator keys
    const delegator = getServiceId(regs.get(9));
    // `r`: manages creation of new services with id within protected range
    const registrar = getServiceId(regs.get(10));
    // `o`: memory offset
    const sourceStart = regs.get(11);
    // `n`: number of items in the auto-accumulate dictionary
    const numberOfItems = regs.get(12);

    /*
     * `z`: array of key-value pairs serviceId -> gas that auto-accumulate every block
     * https://graypaper.fluffylabs.dev/#/7e6ff6a/368100368100?v=0.6.7
     */
    const autoAccumulate: Map<ServiceId, ServiceGas> = new Map();
    const result = safeAllocUint8Array(tryAsExactBytes(serviceIdAndGasCodec.sizeHint));
    const decoder = Decoder.fromBlob(result);
    let memIndex = sourceStart;
    for (let i = 0n; i < numberOfItems; i += 1n) {
      // load next item and reset the decoder
      decoder.resetTo(0);
      const memoryReadResult = memory.loadInto(result, memIndex);
      if (memoryReadResult.isError) {
        logger.trace`[${this.currentServiceId}] BLESS(m: ${manager}, v: ${delegator}, r: ${registrar}) <- PANIC`;
        return PvmExecution.Panic;
      }

      const { serviceId, gas } = decoder.object(serviceIdAndGasCodec);
      autoAccumulate.set(serviceId, gas);
      // we allow the index to go beyond `MEMORY_SIZE` (i.e. 2**32) and have the next `loadInto` fail with page fault.
      memIndex = tryAsU64(memIndex + tryAsU64(decoder.bytesRead()));
    }
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/367200367200?v=0.6.7
    const res = safeAllocUint8Array(tryAsExactBytes(codec.u32.sizeHint) * this.chainSpec.coresCount);
    const assignersDecoder = Decoder.fromBlob(res);
    const memoryReadResult = memory.loadInto(res, assignersPtr);
    if (memoryReadResult.isError) {
```
