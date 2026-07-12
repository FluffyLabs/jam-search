---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/info.ts#L1-L103
title: packages/jam/jam-host-calls/general/info.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 2de8c84182534d29c705a99b8278f36840ab144ee61a2d7e8d836832ac038cef
language: typescript
---
`packages/jam/jam-host-calls/general/info.ts` (lines 1–103)

```typescript
import { type ServiceId, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { codec, Encoder } from "@typeberry/codec";
import { HASH_SIZE } from "@typeberry/hash";
import { minU64, tryAsU64 } from "@typeberry/numbers";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { ServiceAccountInfo } from "@typeberry/state";
import { Compatibility, GpVersion, TestSuite } from "@typeberry/utils";
import { logger } from "../logger.js";
import { getServiceIdOrCurrent } from "../utils.js";
import { HostCallResult } from "./results.js";

/** Account data interface for info host calls. */
export interface AccountsInfo {
  /** Get account info. */
  getServiceInfo(serviceId: ServiceId | null): ServiceAccountInfo | null;
}

const IN_OUT_REG = 7;

const OFFSET_REG =
  Compatibility.isSuite(TestSuite.W3F_DAVXY) || Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) ? 9 : 11;
export const LEN_REG =
  Compatibility.isSuite(TestSuite.W3F_DAVXY) || Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) ? 10 : 12;

/**
 * Return info about some account.
 *
 * `E(a_c, E8(a_b, a_t, a_g , a_m, a_o), E4(a_i), E8(a_f), E4(a_r, a_a, a_p))`
 * c = code hash
 * b = balance
 * t = threshold balance
 * g = minimum gas for accumulate
 * m = minimum gas for on transfer
 * o = total number of octets stored.
 * i = number of items in the storage
 * f = gratis storage (can bring down whole threshold cost to zero)
 * r = creation timeslot
 * a = last accumulation timeslot
 * p = parent service
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/333b00333b00?v=0.7.2
 */
export class Info implements HostCallHandler {
  index = tryAsHostCallIndex(5);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, OFFSET_REG, LEN_REG);

  static new(currentServiceId: ServiceId, account: AccountsInfo) {
    return new Info(currentServiceId, account);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly account: AccountsInfo,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<undefined | PvmExecution> {
    // t
    const serviceId = getServiceIdOrCurrent(IN_OUT_REG, regs, this.currentServiceId);
    // o
    const outputStart = regs.get(8);

    // v
    const accountInfo = this.account.getServiceInfo(serviceId);

    const encodedInfo =
      accountInfo === null
        ? BytesBlob.empty()
        : Encoder.encodeObject(codecServiceAccountInfoWithThresholdBalance, {
            ...accountInfo,
            thresholdBalance: ServiceAccountInfo.calculateThresholdBalance(
              accountInfo.storageUtilisationCount,
              accountInfo.storageUtilisationBytes,
              accountInfo.gratisStorage,
            ),
          });

    const valueLength = tryAsU64(encodedInfo.length);
    // f
    const offset = minU64(regs.get(OFFSET_REG), valueLength);
    // l
    const length = minU64(regs.get(LEN_REG), tryAsU64(valueLength - offset));

    // NOTE: casting to `Number` is safe in both places, since we are always bounded
    // by the actual `encodedInfo.length`, which is equal `96`.
    const chunk = encodedInfo.raw.subarray(Number(offset), Number(offset + length));

    const writeResult = memory.storeFrom(outputStart, chunk);
    if (writeResult.isError) {
      logger.trace`[${this.currentServiceId}] INFO(${serviceId}, off: ${offset}, len: ${length}) <- PANIC`;
      return PvmExecution.Panic;
    }

    logger.trace`[${this.currentServiceId}] INFO(${serviceId}, off: ${offset}, len: ${length}) <- ${BytesBlob.blobFrom(chunk)}`;

    if (accountInfo === null) {
      regs.set(IN_OUT_REG, HostCallResult.NONE);
      return;
    }

```
