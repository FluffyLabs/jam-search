---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-data.ts#L1-L116
title: packages/jam/transition/accumulate/accumulate-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 3
content_sha: b6ee3759c9a5416a7bca17785011e97096e1ec802ba9d7dda4964811edccf83b
language: typescript
---
`packages/jam/transition/accumulate/accumulate-data.ts` (lines 1–116)

```typescript
import { type ServiceGas, type ServiceId, tryAsServiceGas } from "@typeberry/block";
import type { WorkReport } from "@typeberry/block/work-report.js";
import type { ArrayView } from "@typeberry/collections";
import type { PendingTransfer } from "@typeberry/jam-host-calls";
import { MAX_VALUE_U64, sumU64, tryAsU32, type U32 } from "@typeberry/numbers";
import { Operand } from "./operand.js";

class AccumulateDataItem {
  private constructor(
    public operands: Operand[],
    public reportsLength: U32,
  ) {}

  static empty() {
    return new AccumulateDataItem([], tryAsU32(0));
  }
}

/**
 *  Utility class for transforming reports into a format that provides easy access to:
 * - all service ids that are under accumulation
 * - operands for each service (PVM invocation)
 * - gas cost and reports length for each service (statistics)
 */
export class AccumulateData {
  private readonly reportsDataByServiceId: Map<ServiceId, AccumulateDataItem>;
  private readonly transfersByServiceId: Map<ServiceId, PendingTransfer[]>;
  private readonly serviceIds: ServiceId[];
  private readonly gasLimitByServiceId: Map<ServiceId, ServiceGas>;

  constructor(
    reports: ArrayView<WorkReport>,
    transfers: PendingTransfer[],
    autoAccumulateServicesByServiceId: Map<ServiceId, ServiceGas>,
  ) {
    const serviceIdsFromAutoAccumulate = new Set(autoAccumulateServicesByServiceId.keys());
    const {
      reportsDataByServiceId,
      serviceIds: serviceIdsFromReports,
      gasLimitByServiceId: reportsGasLimitByServiceId,
    } = this.transformReports(reports);
    this.reportsDataByServiceId = reportsDataByServiceId;

    const {
      transfersByServiceId,
      serviceIds: serviceIdsFromTransfers,
      gasLimitByServiceId: transfersGasLimitByServiceId,
    } = this.transformTransfers(transfers);
    this.transfersByServiceId = transfersByServiceId;
    /**
     * Merge service ids from reports, auto-accumulate services and transfers.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/173803174b03?v=0.7.2
     */
    this.serviceIds = this.mergeServiceIds(
      serviceIdsFromReports,
      serviceIdsFromAutoAccumulate,
      serviceIdsFromTransfers,
    );

    /**
     * Merge gas limits from reports, auto-accumulate services and transfers.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/182001183701?v=0.7.2
     */
    this.gasLimitByServiceId = this.mergeGasLimitByServiceId(
      this.serviceIds,
      autoAccumulateServicesByServiceId,
      reportsGasLimitByServiceId,
      transfersGasLimitByServiceId,
    );
  }

  /**
   * Calculate the gas limit implied by the selected deferred-transfers, work-reports and gas-privileges.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/182001183701?v=0.7.2
   */
  private mergeGasLimitByServiceId(serviceIds: ServiceId[], ...gasLimitByServiceIdMaps: Map<ServiceId, ServiceGas>[]) {
    const gasByServiceId: Map<ServiceId, ServiceGas> = new Map();

    for (const serviceId of serviceIds) {
      const { overflow, value } = sumU64(
        ...gasLimitByServiceIdMaps.map((map) => map.get(serviceId) ?? tryAsServiceGas(0)),
      );
      gasByServiceId.set(serviceId, tryAsServiceGas(overflow ? MAX_VALUE_U64 : value));
    }

    return gasByServiceId;
  }

  /** Merge two sets of service ids */
  private mergeServiceIds(...sources: Set<ServiceId>[]) {
    const merged = new Set<ServiceId>();

    for (const source of sources) {
      for (const serviceId of source) {
        merged.add(serviceId);
      }
    }

    /**
     * Services have to be sorted
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/177003177003?v=0.7.2
     */
    return Array.from(merged).sort((a, b) => a - b);
  }

  /**
   * Transform the list of pending transfers into:
   * - map: transfers by service id
   * - map: gas limit by service id
   * - set: service ids
   */
  private transformTransfers(transfersToTransform: PendingTransfer[]) {
```
