---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-data.ts#L111-L213
title: packages/jam/transition/accumulate/accumulate-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 76ff132fbd0c76daac30b51b7c72a5091f6493a6a13dbbf865ce45964ce827c5
language: typescript
---
`packages/jam/transition/accumulate/accumulate-data.ts` (lines 111–213)

```typescript
   * Transform the list of pending transfers into:
   * - map: transfers by service id
   * - map: gas limit by service id
   * - set: service ids
   */
  private transformTransfers(transfersToTransform: PendingTransfer[]) {
    const transfersByServiceId = new Map<ServiceId, PendingTransfer[]>();
    const serviceIds = new Set<ServiceId>();
    const gasLimitByServiceId: Map<ServiceId, ServiceGas> = new Map();

    for (const transfer of transfersToTransform) {
      const serviceId = transfer.destination;
      const transfers = transfersByServiceId.get(serviceId) ?? [];
      const gas = gasLimitByServiceId.get(serviceId) ?? tryAsServiceGas(0n);
      const { value, overflow } = sumU64(gas, transfer.gas);
      gasLimitByServiceId.set(serviceId, tryAsServiceGas(overflow ? MAX_VALUE_U64 : value));
      transfers.push(transfer);
      transfersByServiceId.set(serviceId, transfers);
      serviceIds.add(serviceId);
    }

    return { transfersByServiceId, serviceIds, gasLimitByServiceId };
  }

  /**
   * A function that transform reports into a list of operands and data needed for statistics (gas cost and reports length).
   */

  /**
   * Transform the list of reports into:
   * - map: AccumulateDataItem by service id
   * - map: gas limit by service id
   * - set: service ids
   */
  private transformReports(reports: ArrayView<WorkReport>) {
    const reportsDataByServiceId = new Map<ServiceId, AccumulateDataItem>();
    const gasLimitByServiceId: Map<ServiceId, ServiceGas> = new Map();
    const serviceIds = new Set<ServiceId>();

    for (const report of reports) {
      for (const result of report.results) {
        const serviceId = result.serviceId;
        serviceIds.add(serviceId);

        const item = reportsDataByServiceId.get(serviceId) ?? AccumulateDataItem.empty();
        const gas = gasLimitByServiceId.get(serviceId) ?? tryAsServiceGas(0n);
        const { value, overflow } = sumU64(gas, result.gas);
        const newGas = tryAsServiceGas(overflow ? MAX_VALUE_U64 : value);
        gasLimitByServiceId.set(serviceId, newGas);

        /**
         * We count the report results and gas cost for each service to update service statistics.
         *
         * https://graypaper.fluffylabs.dev/#/ab2cdbd/180504182604?v=0.7.2
         */
        item.reportsLength = tryAsU32(item.reportsLength + 1);
        /**
         * Transform report into an operand
         *
         * https://graypaper.fluffylabs.dev/#/ab2cdbd/185901181402?v=0.7.2
         */
        item.operands.push(
          Operand.new({
            gas: result.gas, // g
            payloadHash: result.payloadHash, // y
            result: result.result, // d
            authorizationOutput: report.authorizationOutput, // o
            exportsRoot: report.workPackageSpec.exportsRoot, // e
            hash: report.workPackageSpec.hash, // h
            authorizerHash: report.authorizerHash, // a
          }),
        );

        reportsDataByServiceId.set(serviceId, item);
      }
    }

    return { reportsDataByServiceId, serviceIds, gasLimitByServiceId };
  }

  /** Returns the list of operands for a given service id */
  getOperands(serviceId: ServiceId): Operand[] {
    return this.reportsDataByServiceId.get(serviceId)?.operands ?? [];
  }

  /** Returns the list of transfers for a given service id */
  getTransfers(serviceId: ServiceId): PendingTransfer[] {
    return this.transfersByServiceId.get(serviceId) ?? [];
  }

  /** Returns the number of reports to acccumulate for a given service id */
  getReportsLength(serviceId: ServiceId): U32 {
    return this.reportsDataByServiceId.get(serviceId)?.reportsLength ?? tryAsU32(0);
  }

  /** Returns the gas limit for a given service id */
  getGasLimit(serviceId: ServiceId): ServiceGas {
    return this.gasLimitByServiceId.get(serviceId) ?? tryAsServiceGas(0n);
  }

  /**
   * Returns a list of service ids that should be accumulated.
   *
```
