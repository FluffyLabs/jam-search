---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L107-L221
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 7
content_sha: 694de682d58a645ba4d5dcc0d5c927b14976d3d133c354275860402a82c32e64
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 107–221)

```typescript
  private findReportCutoffIndex(gasLimit: ServiceGas, reports: ArrayView<WorkReport>) {
    const reportsLength = reports.length;
    let currentGas = 0n;

    for (let i = 0; i < reportsLength; i++) {
      const report = reports.get(i);
      const resultsGas = report.results.map((result) => result.gas).reduce((a, b) => a + b, 0n);

      if (currentGas + resultsGas > gasLimit) {
        return i;
      }

      currentGas += resultsGas;
    }

    return reportsLength;
  }

  /**
   * A method that prepres PVM executor and state to run accumulation
   *
   * https://graypaper.fluffylabs.dev/#/7e6ff6a/2fdb012fdb01?v=0.6.7
   */
  private async pvmAccumulateInvocation(
    slot: TimeSlot,
    serviceId: ServiceId,
    transfers: PendingTransfer[],
    operands: Operand[],
    gas: ServiceGas,
    entropy: EntropyHash,
    updatedState: PartiallyUpdatedState,
  ): Promise<Result<InvocationResult, PvmInvocationError>> {
    const serviceInfo = updatedState.getServiceInfo(serviceId);
    if (serviceInfo === null) {
      logger.log`Service with id ${serviceId} not found.`;
      return Result.error(PvmInvocationError.NoService, () => `Accumulate: service ${serviceId} not found`);
    }

    const codeHash = serviceInfo.codeHash;
    // TODO [ToDr] Should we check that the preimage is still available?
    const code = updatedState.getPreimage(serviceId, codeHash.asOpaque());

    if (code === null) {
      logger.log`Code with hash ${codeHash} not found for service ${serviceId}.`;
      return Result.error(
        PvmInvocationError.NoPreimage,
        () => `Accumulate: code with hash ${codeHash} not found for service ${serviceId}`,
      );
    }

    if (code.length > W_C) {
      logger.log`Code with hash ${codeHash} is too long for service ${serviceId}.`;
      return Result.error(
        PvmInvocationError.PreimageTooLong,
        () => `Accumulate: code length ${code.length} exceeds max ${W_C} for service ${serviceId}`,
      );
    }

    const nextServiceId = generateNextServiceId({ serviceId, entropy, timeslot: slot }, this.chainSpec, this.blake2b);
    const partialState = AccumulateExternalities.forService({
      chainSpec: this.chainSpec,
      blake2b: this.blake2b,
      updatedState: updatedState,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: nextServiceId,
      currentTimeslot: slot,
    });

    const fetchExternalities = new AccumulateFetchExternalities(entropy, transfers, operands, this.chainSpec);

    const externalities = {
      partialState,
      serviceExternalities: partialState,
      fetchExternalities,
    };

    const executor = await PvmExecutor.createAccumulateExecutor(
      serviceId,
      code,
      externalities,
      this.chainSpec,
      this.options.pvm,
    );

    const invocationArgs = Encoder.encodeObject(ARGS_CODEC, {
      slot,
      serviceId,
      argsLength: tryAsU32(transfers.length + operands.length),
    });
    const result = await executor.run(invocationArgs, gas);
    const [newState, checkpoint] = partialState.getStateUpdates();

    /**
     * PVM invocation returned and error so we return the checkpoint
     *
     * https://graypaper.fluffylabs.dev/#/7e6ff6a/300002300002?v=0.6.7
     */
    if (result.status !== ReturnStatus.OK) {
      logger.trace`[${serviceId}] accumulate finished with ${ReturnStatus[result.status]} reverting to checkpoint.`;
      return Result.ok({ stateUpdate: checkpoint, consumedGas: tryAsServiceGas(result.consumedGas) });
    }

    logger.trace`[${serviceId}] accumulate finished with ${ReturnStatus[result.status]}`;
    /**
     * PVM invocation returned a hash so we override whatever `yield` host call
     * provided.
     *
     * https://graypaper.fluffylabs.dev/#/7e6ff6a/301202301202?v=0.6.7
     */
    if (result.memorySlice.length === HASH_SIZE) {
      const memorySlice = Bytes.fromBlob(result.memorySlice, HASH_SIZE);
      newState.yieldedRoot = memorySlice.asOpaque();
    }

    /**
```
