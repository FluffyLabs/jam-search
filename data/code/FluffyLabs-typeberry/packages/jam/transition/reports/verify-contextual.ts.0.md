---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.ts#L1-L98
title: packages/jam/transition/reports/verify-contextual.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 4
content_sha: ff5019d9cf70f48d1c3aa6fc80f8e44f63c07ed9018ec0b7ac540a32129c165e
language: typescript
---
`packages/jam/transition/reports/verify-contextual.ts` (lines 1–98)

```typescript
import type { HeaderHash } from "@typeberry/block";
import {
  type ExportsRootHash,
  type RefineContext,
  type WorkPackageHash,
  WorkPackageInfo,
} from "@typeberry/block/refine-context.js";
import { HashDictionary } from "@typeberry/collections";
import { HashSet } from "@typeberry/collections/hash-set.js";
import { Logger } from "@typeberry/logger";
import type { U32 } from "@typeberry/numbers";
import type { State } from "@typeberry/state";
import type { BlockState } from "@typeberry/state/recent-blocks.js";
import { OK, Result } from "@typeberry/utils";
import type { RecentHistoryStateUpdate } from "../recent-history.js";
import { ReportsError } from "./error.js";
import type { HeaderChain, ReportsInput } from "./input.js";

const logger = Logger.new(import.meta.filename, "stf:reports");

/** https://graypaper.fluffylabs.dev/#/ab2cdbd/158202158202?v=0.7.2 */
export function verifyContextualValidity(
  input: ReportsInput,
  state: Pick<
    State,
    "getService" | "recentBlocks" | "availabilityAssignment" | "accumulationQueue" | "recentlyAccumulated"
  >,
  headerChain: HeaderChain,
  maxLookupAnchorAge: U32,
): Result<HashDictionary<WorkPackageHash, WorkPackageInfo>, ReportsError> {
  const contexts: RefineContext[] = [];
  // hashes of work packages reported in this extrinsic
  const currentWorkPackages = HashDictionary.new<WorkPackageHash, WorkPackageInfo>();
  const prerequisiteHashes = HashSet.new<WorkPackageHash>();
  const segmentRootLookupHashes = HashSet.new<WorkPackageHash>();

  for (const guaranteeView of input.guarantees) {
    const guarantee = guaranteeView.materialize();
    contexts.push(guarantee.report.context);
    const info = WorkPackageInfo.create({
      workPackageHash: guarantee.report.workPackageSpec.hash,
      segmentTreeRoot: guarantee.report.workPackageSpec.exportsRoot,
    });
    currentWorkPackages.set(info.workPackageHash, info);
    prerequisiteHashes.insertAll(guarantee.report.context.prerequisites);
    segmentRootLookupHashes.insertAll(guarantee.report.segmentRootLookup.map((x) => x.workPackageHash));

    for (const result of guarantee.report.results) {
      const service = state.getService(result.serviceId);
      if (service === null) {
        return Result.error(ReportsError.BadServiceId, () => `No service with id: ${result.serviceId}`);
      }

      /**
       * Check service code hash
       *
       * https://graypaper.fluffylabs.dev/#/ab2cdbd/150804150804?v=0.7.2
       */
      if (!result.codeHash.isEqualTo(service.getInfo().codeHash)) {
        return Result.error(
          ReportsError.BadCodeHash,
          () =>
            `Service (${result.serviceId}) code hash mismatch. Got: ${result.codeHash}, expected: ${service.getInfo().codeHash}`,
        );
      }
    }
  }

  /**
   * There must be no duplicate work-package hashes (i.e.
   * two work-reports of the same package).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/159c02159e02?v=0.7.2
   */
  if (currentWorkPackages.size !== input.guarantees.length) {
    return Result.error(ReportsError.DuplicatePackage, () => "Duplicate work package detected.");
  }

  const minLookupSlot = Math.max(0, input.slot - maxLookupAnchorAge);
  const contextResult = verifyRefineContexts(minLookupSlot, contexts, input.recentBlocksPartialUpdate, headerChain);
  if (contextResult.isError) {
    return contextResult;
  }

  const uniquenessResult = verifyWorkPackagesUniqueness(HashSet.viewDictionaryKeys(currentWorkPackages), state);
  if (uniquenessResult.isError) {
    return uniquenessResult;
  }

  // construct dictionary of recently-reported work packages and their segment roots
  const recentlyReported = HashDictionary.new<WorkPackageHash, ExportsRootHash>();
  for (const recentBlock of state.recentBlocks.blocks) {
    for (const reported of recentBlock.reported.values()) {
      recentlyReported.set(reported.workPackageHash, reported.segmentTreeRoot);
    }
  }

  // Verify pre-requisites
```
