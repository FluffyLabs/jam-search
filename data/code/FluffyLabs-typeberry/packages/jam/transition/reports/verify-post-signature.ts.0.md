---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-post-signature.ts#L1-L81
title: packages/jam/transition/reports/verify-post-signature.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: a15ab89a1773667ae711f4768fd8c976cad66dbe4557342d5aa01d4ecf89a393
language: typescript
---
`packages/jam/transition/reports/verify-post-signature.ts` (lines 1–81)

```typescript
import type { GuaranteesExtrinsicView } from "@typeberry/block/guarantees.js";
import { sumU64 } from "@typeberry/numbers";
import type { State, StateView } from "@typeberry/state";
import { OK, Result } from "@typeberry/utils";
import { ReportsError } from "./error.js";

/** `G_A`: The gas allocated to invoke a work-report’s Accumulation logic. */
export const G_A = 10_000_000;

export function verifyPostSignatureChecks(
  input: GuaranteesExtrinsicView,
  availabilityAssignment: State["availabilityAssignment"],
  authPools: ReturnType<StateView["authPoolsView"]>,
  services: State["getService"],
): Result<OK, ReportsError> {
  for (const guaranteeView of input) {
    const guarantee = guaranteeView.materialize();
    const report = guarantee.report;
    const coreIndex = report.coreIndex;
    /**
     * No reports may be placed on cores with a report pending
     * availability on it.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/155002155002?v=0.7.2
     */
    if (availabilityAssignment[coreIndex] !== null) {
      return Result.error(ReportsError.CoreEngaged, () => `Report pending availability at core: ${coreIndex}`);
    }

    /**
     * A report is valid only if the authorizer hash is present
     * in the authorizer pool of the core on which the work is
     * reported.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/155102155302?v=0.7.2
     */
    const authorizerHash = report.authorizerHash;
    const authorizerPool = authPools.get(coreIndex);
    const pool = authorizerPool?.materialize() ?? [];
    if (pool.find((hash) => hash.isEqualTo(authorizerHash)) === undefined) {
      return Result.error(
        ReportsError.CoreUnauthorized,
        () => `Authorizer hash not found in the pool of core ${coreIndex}: ${authorizerHash}`,
      );
    }

    /**
     * We require that the gas allotted for accumulation of each
     * work-digest in each work-report respects its service’s
     * minimum gas requirements.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/156602156802?v=0.7.2
     */
    for (const result of report.results) {
      const service = services(result.serviceId);
      if (service === null) {
        return Result.error(ReportsError.BadServiceId, () => `No service with id: ${result.serviceId}`);
      }
      const info = service.getInfo();

      // check minimal accumulation gas
      if (result.gas < info.accumulateMinGas) {
        return Result.error(
          ReportsError.ServiceItemGasTooLow,
          () =>
            `Service (${result.serviceId}) gas is less than minimal. Got: ${result.gas}, expected at least: ${info.accumulateMinGas}`,
        );
      }
    }

    const totalGas = sumU64(...report.results.map((x) => x.gas));
    if (totalGas.overflow || totalGas.value > G_A) {
      return Result.error(
        ReportsError.WorkReportGasTooHigh,
        () => `Total gas too high. Got: ${totalGas.value} (ovfl: ${totalGas.overflow}), maximal: ${G_A}`,
      );
    }
  }

  return Result.ok(OK);
}
```
