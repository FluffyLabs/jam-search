---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/importer.ts#L95-L199
title: packages/workers/importer/importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 3
content_sha: b452a44565db8298493a91ec8728a63d4e7eb02e5f950fe0f249648191a39102
language: typescript
---
`packages/workers/importer/importer.ts` (lines 95–199)

```typescript
    this.metrics = metrics.createMetrics();

    this.verifier = BlockVerifier.new(args.hasher, args.blocks);
    this.stf = OnChain.assemble({
      chainSpec: args.spec,
      state,
      hasher: args.hasher,
      options: { pvm: args.pvm, accumulateSequentially: false },
      headerChain: DbHeaderChain.new(args.blocks),
    });
    this.state = state;
    this.currentHash = currentBestHeaderHash;
    this.prepareForNextEpoch();

    this.events.onStart(currentBestHeaderHash, state);
  }

  /** Do some extra work for preparation for the next epoch. */
  public async prepareForNextEpoch() {
    try {
      await this.stf.prepareForNextEpoch();
    } catch (e) {
      this.logger.error`Unable to prepare for next epoch: ${e}`;
    }
  }

  public async importBlockWithStateRoot(block: BlockView): Promise<Result<StateRootHash, ImporterError>> {
    const res = await this.importBlock(block);
    if (res.isOk) {
      return Result.ok(this.state.backend.getStateRoot(this.hasher.blake2b));
    }
    return res;
  }

  public async importBlock(block: BlockView): Promise<Result<WithHash<HeaderHash, HeaderView>, ImporterError>> {
    const timeSlot = extractTimeSlot(block);

    const onEnd = this.events.onBlockImportingStarted(timeSlot);
    this.metrics.recordBlockImportingStarted(timeSlot);

    let maybeBestHeader: Result<WithHash<HeaderHash, HeaderView>, ImporterError> | null = null;
    try {
      maybeBestHeader = await this.importBlockInternal(block);
      return maybeBestHeader;
    } finally {
      const isOk = maybeBestHeader?.isOk ?? false;
      const duration = onEnd(isOk);

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (maybeBestHeader?.isOk) {
        const bestHeader = maybeBestHeader.ok;
        this.logger.info`🧊 Best: #${timeSlot} (${bestHeader.hash.toStringTruncated()})`;
        this.metrics.recordBlockImportComplete(duration, true);
      } else {
        this.logger
          .log`❌ Rejected #${timeSlot}: ${maybeBestHeader !== null ? resultToString(maybeBestHeader) : "exception"}`;
        this.metrics.recordBlockImportComplete(duration, false);
      }
    }
  }

  private async importBlockInternal(
    block: BlockView,
  ): Promise<Result<WithHash<HeaderHash, HeaderView>, ImporterError>> {
    const logger = this.logger;
    logger.log`🧱 Attempting to import a new block`;

    const timerVerify = MEASURE.importVerify();
    const hash = await this.verifier.verifyBlock(block, {
      skipParentAndStateRoot: this.options.initGenesisFromAncestry ?? false,
    });
    if (hash.isError) {
      logger.log`${timerVerify}`;
      this.metrics.recordBlockVerificationFailed(resultToString(hash));
      return importerError(ImporterErrorKind.Verifier, hash);
    }
    logger.log`${hash.ok} ${timerVerify}`;
    this.metrics.recordBlockVerified(timerVerify.duration());

    // TODO [ToDr] This is incomplete/temporary fork support!
    const parentHash = block.header.view().parentHeaderHash.materialize();
    if (!this.currentHash.isEqualTo(parentHash)) {
      const state = this.states.getState(parentHash);
      if (state === null) {
        const e = Result.error(
          BlockVerifierError.StateRootNotFound,
          () => `State not found for parent block ${parentHash}`,
        );
        if (!e.isError) {
          throw new Error("unreachable, just adding to make compiler happy");
        }
        return importerError(ImporterErrorKind.Verifier, e);
      }
      this.state.updateBackend(state?.backend);
      this.prepareForNextEpoch();
      this.currentHash = parentHash;
    }

    const timeSlot = block.header.view().timeSlotIndex.materialize();
    const headerHash = hash.ok;
    logger.log`🧱 Verified block: Got hash ${headerHash} for block at slot ${timeSlot}.`;
    const timerStf = MEASURE.importStf();
    const res = await this.stf.transition(block, headerHash);
    logger.log`${headerHash} ${timerStf}`;
    if (res.isError) {
```
