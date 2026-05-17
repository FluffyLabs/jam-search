---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/importer.ts#L99-L202
title: packages/workers/importer/importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: 06c770cfbdfd5b4d9848fe5fb0d6fa88a7a11270ec0803a1a373a0c83f4a5a16
language: typescript
---
`packages/workers/importer/importer.ts` (lines 99–202)

```typescript
    args.logger.info`😎 Best time slot: ${state.timeslot} (header hash: ${currentBestHeaderHash})`;
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
    const timer = measure("importBlock");
    const timeSlot = extractTimeSlot(block);

    this.metrics.recordBlockImportingStarted(timeSlot);

    const startTime = now();
    const maybeBestHeader = await this.importBlockInternal(block);
    const duration = now() - startTime;

    if (maybeBestHeader.isOk) {
      const bestHeader = maybeBestHeader.ok;
      this.logger.info`🧊 Best block: #${timeSlot} (${bestHeader.hash})`;
      this.logger.log`${timer()}`;
      this.metrics.recordBlockImportComplete(duration, true);
      return maybeBestHeader;
    }

    this.logger.log`❌ Rejected block #${timeSlot}: ${resultToString(maybeBestHeader)}`;
    this.logger.log`${timer()}`;
    this.metrics.recordBlockImportComplete(duration, false);
    return maybeBestHeader;
  }

  private async importBlockInternal(
    block: BlockView,
  ): Promise<Result<WithHash<HeaderHash, HeaderView>, ImporterError>> {
    const logger = this.logger;
    logger.log`🧱 Attempting to import a new block`;

    const timerVerify = measure("import:verify");
    const verifyStart = now();
    const hash = await this.verifier.verifyBlock(block, {
      skipParentAndStateRoot: this.options.initGenesisFromAncestry ?? false,
    });
    const verifyDuration = now() - verifyStart;
    logger.log`${timerVerify()}`;
    if (hash.isError) {
      this.metrics.recordBlockVerificationFailed(resultToString(hash));
      return importerError(ImporterErrorKind.Verifier, hash);
    }
    this.metrics.recordBlockVerified(verifyDuration);

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
    const timerStf = measure("import:stf");
    const stfStart = now();
    const res = await this.stf.transition(block, headerHash);
    const stfDuration = now() - stfStart;
    logger.log`${timerStf()}`;
    if (res.isError) {
      this.metrics.recordBlockExecutionFailed(resultToString(res));
      return importerError(ImporterErrorKind.Stf, res);
    }
    this.metrics.recordBlockExecuted(stfDuration, 0);
    // modify the state
    const update = res.ok;
    const timerState = measure("import:state");
    const updateResult = await this.states.updateAndSetState(headerHash, this.state, update);
    if (updateResult.isError) {
      logger.error`🧱 Unable to update state: ${resultToString(updateResult)}`;
      return importerError(ImporterErrorKind.Update, updateResult);
    }

```
