---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.ts#L92-L200
title: packages/jam/transition/reports/verify-contextual.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 4
content_sha: a8dccf9ea6f68e9c72cbfb30e36baded412acae1ba59c57273701d17eb7907cf
language: typescript
---
`packages/jam/transition/reports/verify-contextual.ts` (lines 92–200)

```typescript
  for (const recentBlock of state.recentBlocks.blocks) {
    for (const reported of recentBlock.reported.values()) {
      recentlyReported.set(reported.workPackageHash, reported.segmentTreeRoot);
    }
  }

  // Verify pre-requisites
  const prerequisitesResult = verifyDependencies({
    currentWorkPackages,
    recentlyReported,
    prerequisiteHashes,
    segmentRootLookupHashes,
  });
  if (prerequisitesResult.isError) {
    return prerequisitesResult;
  }

  // check that every item in report.segmentRootLookup
  // is matching the mapping in:
  // - either currently work package info
  // - recently reported work package info
  // (i.e. segmentRootLookup needs to be a sub-dictionary)
  for (const gurantee of input.guarantees) {
    const report = gurantee.materialize().report;
    for (const lookup of report.segmentRootLookup) {
      let root = currentWorkPackages.get(lookup.workPackageHash);
      if (root === undefined) {
        const exportsRoot = recentlyReported.get(lookup.workPackageHash);
        root =
          exportsRoot !== undefined
            ? WorkPackageInfo.create({ workPackageHash: lookup.workPackageHash, segmentTreeRoot: exportsRoot })
            : undefined;
      }
      if (root === undefined || !root.segmentTreeRoot.isEqualTo(lookup.segmentTreeRoot)) {
        return Result.error(
          ReportsError.SegmentRootLookupInvalid,
          () =>
            `Mismatching segment tree root for package ${lookup.workPackageHash}. Got: ${lookup.segmentTreeRoot}, expected: ${root?.segmentTreeRoot}`,
        );
      }
    }
  }

  return Result.ok(currentWorkPackages);
}

/** https://graypaper.fluffylabs.dev/#/ab2cdbd/15cd0215cd02?v=0.7.2 */
function verifyRefineContexts(
  minLookupSlot: number,
  contexts: RefineContext[],
  recentBlocksPartialUpdate: RecentHistoryStateUpdate["recentBlocks"],
  headerChain: HeaderChain,
): Result<OK, ReportsError> {
  // TODO [ToDr] [opti] This could be cached and updated efficiently between runs.
  const recentBlocks = HashDictionary.new<HeaderHash, BlockState>();
  for (const recentBlock of recentBlocksPartialUpdate.blocks) {
    recentBlocks.set(recentBlock.headerHash, recentBlock);
  }

  for (const context of contexts) {
    /**
     * We require that the anchor block be within the last H
     * blocks and that its details be correct by ensuring that it
     * appears within our most recent blocks β†:
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/15ad0215af02?v=0.7.2
     */
    const recentBlock = recentBlocks.get(context.anchor);
    if (recentBlock === undefined) {
      return Result.error(
        ReportsError.AnchorNotRecent,
        () => `Anchor block ${context.anchor} not found in recent blocks.`,
      );
    }

    // check state root
    if (!recentBlock.postStateRoot.isEqualTo(context.stateRoot)) {
      return Result.error(
        ReportsError.BadStateRoot,
        () => `Anchor state root mismatch. Got: ${context.stateRoot}, expected: ${recentBlock.postStateRoot}.`,
      );
    }

    // check beefy root
    const beefyRoot = recentBlock.accumulationResult;
    if (!beefyRoot.isEqualTo(context.beefyRoot)) {
      return Result.error(
        ReportsError.BadBeefyMmrRoot,
        () =>
          `Invalid BEEFY super peak hash. Got: ${context.beefyRoot}, expected: ${beefyRoot}. Anchor: ${recentBlock.headerHash}`,
      );
    }

    /**
     * We require that each lookup-anchor block be within the
     * last L timeslots.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/15ce0215cf02?v=0.7.2
     */
    if (context.lookupAnchorSlot < minLookupSlot) {
      return Result.error(
        ReportsError.SegmentRootLookupInvalid,
        () => `Lookup anchor slot's too old. Got: ${context.lookupAnchorSlot}, minimal: ${minLookupSlot}`,
      );
    }

    /**
     * We also require that we have a record of it; this is one of
     * the few conditions which cannot be checked purely with
```
