---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/importer.ts#L195-L284
title: packages/workers/importer/importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 29224070cbad312cf539f2f53d2e09bf01f2b9eb18b5addde9c8b85f35161dc2
language: typescript
---
`packages/workers/importer/importer.ts` (lines 195–284)

```typescript
    logger.log`🧱 Verified block: Got hash ${headerHash} for block at slot ${timeSlot}.`;
    const timerStf = MEASURE.importStf();
    const res = await this.stf.transition(block, headerHash);
    logger.log`${headerHash} ${timerStf}`;
    if (res.isError) {
      this.metrics.recordBlockExecutionFailed(resultToString(res));
      return importerError(ImporterErrorKind.Stf, res);
    }
    this.metrics.recordBlockExecuted(timerStf.duration(), 0);
    // modify the state
    const update = res.ok;
    const timerState = MEASURE.importState();
    const updateResult = await this.states.updateAndSetState(headerHash, this.state, update);
    if (updateResult.isError) {
      logger.error`🧱 Unable to update state: ${resultToString(updateResult)}`;
      return importerError(ImporterErrorKind.Update, updateResult);
    }

    this.prepareForNextEpoch();
    this.currentHash = headerHash;
    logger.log`${timerState}`;

    // insert new state and the block to DB.
    const timerDb = MEASURE.importDb();
    const writeBlocks = this.blocks.insertBlock(WithHash.new(headerHash, block));

    // Computation of the state root may happen asynchronously,
    // but we still need to wait for it before next block can be imported
    const stateRoot = await this.states.getStateRoot(this.state);
    logger.log`🧱 Storing post-state-root for ${headerHash}: ${stateRoot}.`;
    const writeStateRoot = this.blocks.setPostStateRoot(headerHash, stateRoot);

    await Promise.all([writeBlocks, writeStateRoot]);
    logger.log`${headerHash} ${timerDb}`;
    // finally update the best block
    await this.blocks.setBestHeaderHash(headerHash);

    // check for finality and prune old states (and optionally blocks)
    const finality = this.options.finalizer?.onBlockImported(headerHash) ?? null;
    if (finality !== null) {
      const pruneBlocks = this.options.pruneBlocks ?? false;
      this.logger
        .info`🦭 Finalized: ${finality.finalizedHash.toStringTruncated()} (${finality.prunableStateHashes.length} to prune, blocks: ${pruneBlocks})`;
      // Commit the finalized blocks BEFORE pruning: `markUnused` treats states
      // with a pending value delta as dead forks and releases their values.
      this.states.commitFinalized(finality.newlyFinalizedHeaders);
      for (const hash of finality.prunableStateHashes) {
        this.states.markUnused(hash);
        if (pruneBlocks) {
          this.blocks.markUnused(hash);
        }
      }
    }

    return Result.ok(WithHash.new(headerHash, block.header.view()));
  }

  getBestStateRootHash() {
    const bestHeaderHash = this.blocks.getBestHeaderHash();
    const stateRoot = this.blocks.getPostStateRoot(bestHeaderHash);
    return stateRoot;
  }

  getBestBlockHash() {
    return this.blocks.getBestHeaderHash();
  }

  getStateEntries(headerHash: HeaderHash) {
    const state = this.states.getState(headerHash);
    const stateEntries = state?.backend.intoStateEntries();
    return stateEntries ?? null;
  }
  async close() {
    await this.blocks.close();
    await this.states.close();
  }
}

/**
 * Attempt to safely extract timeslot of a block.
 *
 * NOTE: it may fail if encoding is invalid.
 */
function extractTimeSlot(block: BlockView) {
  try {
    return block.header.view().timeSlotIndex.materialize();
  } catch {
    return tryAsTimeSlot(2 ** 32 - 1);
  }
}
```
