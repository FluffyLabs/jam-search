---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/refine.ts#L117-L241
title: packages/jam/in-core/refine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 0b18880a5b8d64bd9bfb01cf163b3b0f0d88e5202455a959822ab0a123cd096a
language: typescript
---
`packages/jam/in-core/refine.ts` (lines 117–241)

```typescript
    const code = maybeCode.ok;
    const externalities = this.createRefineExternalities({
      packageFetchData,
      currentWorkItemIndex: idx,
      imports: allImports,
      extrinsics: allExtrinsics,
      currentServiceId: item.service,
      lookupState,
      exportOffset,
      authorizerTrace,
    });

    const executor = await PvmExecutor.createRefineExecutor(item.service, code, externalities, this.pvmBackend);

    const args = Encoder.encodeObject(REFINE_ARGS_CODEC, {
      serviceId: item.service,
      core: coreIndex,
      workItemIndex: tryAsU32(idx),
      payloadLength: tryAsU32(item.payload.length),
      packageHash: workPackageHash,
    });

    const execResult = await executor.run(args, item.refineGasLimit);

    const exports = externalities.refine.getExportedSegments();
    if (exports.length !== item.exportCount) {
      return {
        exports: [],
        result: WorkResult.create({
          ...baseResult,
          result: WorkExecResult.error(WorkExecResultKind.incorrectNumberOfExports),
          load: WorkRefineLoad.create({
            ...baseLoad,
            gasUsed: tryAsServiceGas(item.refineGasLimit),
            exportedSegments: tryAsU32(0),
          }),
        }),
      };
    }

    const result = Refine.extractWorkResult(execResult);

    return {
      exports,
      result: WorkResult.create({
        ...baseResult,
        result,
        load: WorkRefineLoad.create({
          ...baseLoad,
          gasUsed: tryAsServiceGas(execResult.consumedGas),
          exportedSegments: tryAsU32(exports.length),
        }),
      }),
    };
  }

  static extractWorkResult(execResult: ReturnValue<ServiceGas>) {
    if (execResult.status === ReturnStatus.OK) {
      const slice = execResult.memorySlice;
      // TODO [ToDr] Verify the output size and change digestTooBig?
      return WorkExecResult.ok(BytesBlob.blobFrom(slice));
    }

    switch (execResult.status) {
      case ReturnStatus.OOG:
        return WorkExecResult.error(WorkExecResultKind.outOfGas);
      case ReturnStatus.PANIC:
        return WorkExecResult.error(WorkExecResultKind.panic);
      default:
        assertNever(execResult);
    }
  }

  private getServiceCode(state: State, idx: number, item: WorkItem) {
    const serviceId = item.service;
    const service = state.getService(serviceId);
    // TODO [ToDr] GP link
    // missing service
    if (service === null) {
      return Result.error(
        ServiceCodeError.ServiceNotFound,
        () => `[i:${idx}] Service ${serviceId} is missing in state.`,
      );
    }

    // TODO [ToDr] GP link
    // TODO [ToDr] shall we rather use the old codehash instead
    if (!service.getInfo().codeHash.isEqualTo(item.codeHash)) {
      return Result.error(
        ServiceCodeError.ServiceCodeMismatch,
        () =>
          `[i:${idx}] Service ${serviceId} has invalid code hash. Ours: ${service.getInfo().codeHash}, expected: ${item.codeHash}`,
      );
    }

    const code = service.getPreimage(item.codeHash.asOpaque());
    if (code === null) {
      return Result.error(
        ServiceCodeError.ServiceCodeMissing,
        () => `[i:${idx}] Code ${item.codeHash} for service ${serviceId} was not found.`,
      );
    }

    if (code.length > W_C) {
      return Result.error(
        ServiceCodeError.ServiceCodeTooBig,
        () =>
          `[i:${idx}] Code ${item.codeHash} for service ${serviceId} is too big! ${code.length} bytes vs ${W_C} bytes max.`,
      );
    }

    return Result.ok(code);
  }

  private createRefineExternalities(args: {
    packageFetchData: WorkPackageFetchData;
    currentWorkItemIndex: number;
    imports: PerWorkItem<ImportedSegment[]>;
    extrinsics: PerWorkItem<WorkItemExtrinsic[]>;
    currentServiceId: ServiceId;
    lookupState: State;
    exportOffset: number;
    authorizerTrace: BytesBlob;
  }): RefineHostCallExternalities {
    const fetchExternalities = new RefineFetchExternalities(this.chainSpec, {
```
