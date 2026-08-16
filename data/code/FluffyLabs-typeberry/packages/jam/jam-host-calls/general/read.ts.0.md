---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/read.ts#L1-L98
title: packages/jam/jam-host-calls/general/read.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 55dc5814645497ef66ffb29bed54c009095bc17bbd45ec3d0b2411542c7caa89
language: typescript
---
`packages/jam/jam-host-calls/general/read.ts` (lines 1–98)

```typescript
import type { ServiceId } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { minU64, tryAsU64 } from "@typeberry/numbers";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { safeAllocUint8Array } from "@typeberry/utils";
import { logger } from "../logger.js";
import { clampU64ToU32, getServiceIdOrCurrent } from "../utils.js";
import { HostCallResult } from "./results.js";

/** Account data interface for read host calls. */
export interface AccountsRead {
  /** Read service storage. */
  read(serviceId: ServiceId | null, rawKey: BytesBlob): BytesBlob | null;
}

const IN_OUT_REG = 7;

/**
 * Read account storage.
 *
 * https://graypaper.fluffylabs.dev/#/1c979cb/325301325301?v=0.7.1
 */
export class Read implements HostCallHandler {
  index = tryAsHostCallIndex(3);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, 9, 10, 11, 12);

  static new(currentServiceId: ServiceId, account: AccountsRead) {
    return new Read(currentServiceId, account);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly account: AccountsRead,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<undefined | PvmExecution> {
    // a
    const serviceId = getServiceIdOrCurrent(IN_OUT_REG, regs, this.currentServiceId);

    // k_o
    const storageKeyStartAddress = regs.get(8);
    // k_z
    const storageKeyLength = regs.get(9);
    // o
    const destinationAddress = regs.get(10);

    const storageKeyLengthClamped = clampU64ToU32(storageKeyLength);
    // k
    const rawKey = BytesBlob.blobFrom(safeAllocUint8Array(storageKeyLengthClamped));

    const memoryReadResult = memory.loadInto(rawKey.raw, storageKeyStartAddress);
    if (memoryReadResult.isError) {
      logger.trace`READ(${serviceId}, ${rawKey}) <- PANIC`;
      return PvmExecution.Panic;
    }

    // v
    const value = this.account.read(serviceId, rawKey);

    const valueLength = value === null ? tryAsU64(0) : tryAsU64(value.raw.length);
    const valueBlobOffset = regs.get(11);
    const lengthToWrite = regs.get(12);

    // f
    const offset = minU64(valueBlobOffset, valueLength);
    // l
    const blobLength = minU64(lengthToWrite, tryAsU64(valueLength - offset));

    // NOTE [MaSo] this is ok to cast to number, because we are bounded by the
    // valueLength in both cases and valueLength is WC (4,000,000,000) + metadata
    // which is less than 2^32
    const chunk =
      value === null ? safeAllocUint8Array(0) : value.raw.subarray(Number(offset), Number(offset + blobLength));
    const memoryWriteResult = memory.storeFrom(destinationAddress, chunk);
    if (memoryWriteResult.isError) {
      logger.trace`[${this.currentServiceId}] READ(${serviceId}, ${rawKey}) <- PANIC`;
      return PvmExecution.Panic;
    }

    if (value === null) {
      logger.trace`[${this.currentServiceId}] READ(${serviceId}, ${rawKey}) <- NONE`;
      regs.set(IN_OUT_REG, HostCallResult.NONE);
      return;
    }

    if (chunk.length > 0) {
      logger.trace`[${this.currentServiceId}] READ(${serviceId}, ${rawKey}) <- ${BytesBlob.blobFrom(chunk).toStringTruncated()}`;
      logger.insane`[${this.currentServiceId}] READ(${serviceId}, ${rawKey}) <- ${BytesBlob.blobFrom(chunk)}`;
    } else {
      // just a query for length of stored data
      logger.trace`[${this.currentServiceId}] READ(${serviceId}, ${rawKey}) <- (${valueLength} ${valueLength === 1n ? "byte" : "bytes"})`;
    }
    regs.set(IN_OUT_REG, valueLength);
  }
}
```
