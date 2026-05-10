---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/in-core.ts#L94-L211
title: packages/jam/in-core/in-core.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: d7fe036f64e3d1b40cffa769c7ee7aa7c42ec0f54c1d4ad9d9dcc06fcb338dab
language: typescript
---
`packages/jam/in-core/in-core.ts` (lines 94–211)

```typescript
          `State at ${context.anchor} does not match expected root hash. Ours: ${stateRoot}, expected: ${context.stateRoot}`,
      );
    }

    // TODO [ToDr] GP link
    // Verify lookup anchor state
    const lookupState = this.states.getState(context.lookupAnchor);
    if (lookupState === null) {
      return Result.error(RefineError.StateMissing, () => `Lookup state at block ${context.lookupAnchor} is missing.`);
    }

    // TODO [ToDr] GP link
    if (lookupState.timeslot !== context.lookupAnchorSlot) {
      return Result.error(
        RefineError.InvalidLookupAnchorSlot,
        () =>
          `Lookup anchor slot does not match the one is state. Ours: ${lookupState.timeslot}, expected: ${context.lookupAnchorSlot}`,
      );
    }

    // Eagerly build the per-package fetch data so we pay the encoding cost
    const packageFetchData = buildWorkPackageFetchData(this.chainSpec, workPackageAndHash.data);

    // Check authorization
    const authResult = await this.isAuthorized.invoke(state, core, packageFetchData);
    if (authResult.isError) {
      return Result.error(
        RefineError.AuthorizationError,
        () => `Authorization error: ${AuthorizationError[authResult.error]}: ${authResult.details()}.`,
      );
    }

    logger.log`[core:${core}] Authorized. Proceeding with work items verification. Anchor=${context.anchor}`;

    // Verify the work items
    let exportOffset = 0;
    const refineResults: RefineItemResult[] = [];
    for (const [idx, item] of items.entries()) {
      logger.info`[core:${core}][i:${idx}] Refining item for service ${item.service}.`;

      const result = await this.refineItem.invoke(
        state,
        lookupState,
        packageFetchData,
        idx,
        item,
        imports,
        extrinsics,
        core,
        workPackageHash,
        exportOffset,
        authResult.ok.authorizationOutput,
      );
      refineResults.push(result);
      exportOffset += result.exports.length;
    }

    // amalgamate the work report now
    return Result.ok(
      InCore.amalgamateWorkReport(asKnownSize(refineResults), authResult.ok, workPackageHash, context, core),
    );
  }

  private static amalgamateWorkReport(
    refineResults: PerWorkItem<RefineItemResult>,
    authResult: AuthorizationOk,
    workPackageHash: WorkPackageHash,
    context: RefineContext,
    coreIndex: CoreIndex,
  ) {
    // unzip exports and work results for each work item
    const exports = refineResults.map((x) => x.exports);
    const results = refineResults.map((x) => x.result);

    const { authorizerHash, authorizationGasUsed, authorizationOutput, ...authRest } = authResult;
    assertEmpty(authRest);

    // TODO [ToDr] Compute erasure root
    const erasureRoot = Bytes.zero(HASH_SIZE);
    // TODO [ToDr] Compute exports root
    const exportsRoot = Bytes.zero(HASH_SIZE).asOpaque();
    const exportsCount = exports.reduce((acc, x) => acc + x.length, 0);

    // TODO [ToDr] Segment root lookup computation?
    const segmentRootLookup = [
      WorkPackageInfo.create({
        workPackageHash,
        segmentTreeRoot: exportsRoot,
      }),
    ];

    // TODO [ToDr] Auditable work bundle length?
    const workBundleLength = tryAsU32(0);

    return {
      report: WorkReport.create({
        workPackageSpec: WorkPackageSpec.create({
          length: workBundleLength,
          hash: workPackageHash,
          erasureRoot,
          exportsRoot,
          // safe to convert, since we have limit on number of
          // exports per item and a limit for number of items
          exportsCount: tryAsU16(exportsCount),
        }),
        context,
        coreIndex,
        authorizerHash,
        authorizationGasUsed,
        authorizationOutput,
        segmentRootLookup,
        // safe to convert, since we know that number of work items is limited
        results: FixedSizeArray.new(results, tryAsU8(refineResults.length)),
      }),
      exports: asKnownSize(exports),
    };
  }
}
```
