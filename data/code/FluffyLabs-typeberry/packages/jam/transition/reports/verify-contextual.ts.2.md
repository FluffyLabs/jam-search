---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.ts#L194-L305
title: packages/jam/transition/reports/verify-contextual.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 4
content_sha: 846cafa85b32102ca4d872af14eafaeccd62c354c70ed6d3f713070dbb48dd2b
language: typescript
---
`packages/jam/transition/reports/verify-contextual.ts` (lines 194–305)

```typescript
        () => `Lookup anchor slot's too old. Got: ${context.lookupAnchorSlot}, minimal: ${minLookupSlot}`,
      );
    }

    /**
     * We also require that we have a record of it; this is one of
     * the few conditions which cannot be checked purely with
     * on-chain state and must be checked by virtue of retaini
     * ing the series of the last L headers as the ancestor set A.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/15e40215e702?v=0.7.2
     */
    const isInChain =
      recentBlocks.has(context.lookupAnchor) ||
      headerChain.isAncestor(context.lookupAnchorSlot, context.lookupAnchor, context.anchor);
    if (!isInChain) {
      if (process.env.SKIP_LOOKUP_ANCHOR_CHECK !== undefined) {
        logger.warn`Lookup anchor check for ${context.lookupAnchor} would fail, but override is active.`;
      } else {
        return Result.error(
          ReportsError.SegmentRootLookupInvalid,
          () =>
            `Lookup anchor is not found in chain. Hash: ${context.lookupAnchor} (slot: ${context.lookupAnchorSlot})`,
        );
      }
    }
  }

  return Result.ok(OK);
}

function verifyDependencies({
  currentWorkPackages,
  recentlyReported,
  prerequisiteHashes,
  segmentRootLookupHashes,
}: {
  currentWorkPackages: HashDictionary<WorkPackageHash, WorkPackageInfo>;
  recentlyReported: HashDictionary<WorkPackageHash, ExportsRootHash>;
  prerequisiteHashes: HashSet<WorkPackageHash>;
  segmentRootLookupHashes: HashSet<WorkPackageHash>;
}): Result<OK, ReportsError> {
  const checkDependencies = (
    dependencies: HashSet<WorkPackageHash>,
    isSegmentRoot = false,
  ): Result<OK, ReportsError> => {
    /**
     * We require that the prerequisite work-packages, if
     * present, and any work-packages mentioned in the
     * segment-root lookup, be either in the extrinsic or in our
     * recent history.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/156b03156e03?v=0.7.2
     */
    for (const preReqHash of dependencies) {
      if (currentWorkPackages.has(preReqHash)) {
        continue;
      }

      if (recentlyReported.has(preReqHash)) {
        continue;
      }

      return Result.error(
        isSegmentRoot ? ReportsError.SegmentRootLookupInvalid : ReportsError.DependencyMissing,
        () => `Missing work package ${preReqHash} in current extrinsic or recent history.`,
      );
    }

    return Result.ok(OK);
  };

  const prerequisitesResult = checkDependencies(prerequisiteHashes);
  if (prerequisitesResult.isError) {
    return prerequisitesResult;
  }
  // do the same for segmentRootLookupHashes, we need a different set
  // to return a different error for JAM test vectors.
  const segmentRootResult = checkDependencies(segmentRootLookupHashes, true);
  if (segmentRootResult.isError) {
    return segmentRootResult;
  }

  return Result.ok(OK);
}

function verifyWorkPackagesUniqueness(
  workPackageHashes: HashSet<WorkPackageHash>,
  state: Pick<State, "recentBlocks" | "recentlyAccumulated" | "accumulationQueue" | "availabilityAssignment">,
): Result<OK, ReportsError> {
  /**
   * Make sure that the package does not appear anywhere in the pipeline.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/152803152803?v=0.7.2
   */
  // TODO [ToDr] [opti] this most likely should be cached and either
  // re-computed on invalidity or we could maintain additional
  // structure that's in-sync with the state.
  // For now, for the sake of simplicity, let's compute it every time.
  const packagesInPipeline = HashSet.new();

  // all work packages reported in recent blocks
  for (const recentBlock of state.recentBlocks.blocks) {
    packagesInPipeline.insertAll(Array.from(recentBlock.reported.keys()));
  }

  // all work packages recently accumulated
  for (const hashes of state.recentlyAccumulated) {
    packagesInPipeline.insertAll(Array.from(hashes));
  }

  // all work packages that are in reports, which await accumulation
```
