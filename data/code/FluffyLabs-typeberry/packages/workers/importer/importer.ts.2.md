---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/importer.ts#L207-L283
title: packages/workers/importer/importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: fa4e76ee97f05f16c4c8626d92329633db748e63b13c44229916d5e0b40b2bb6
language: typescript
---
`packages/workers/importer/importer.ts` (lines 207–283)

```typescript
    const update = res.ok;
    const timerState = measure("import:state");
    const updateResult = await this.states.updateAndSetState(headerHash, this.state, update);
    if (updateResult.isError) {
      logger.error`🧱 Unable to update state: ${resultToString(updateResult)}`;
      return importerError(ImporterErrorKind.Update, updateResult);
    }

    this.prepareForNextEpoch();
    this.currentHash = headerHash;
    logger.log`${timerState()}`;

    // insert new state and the block to DB.
    const timerDb = measure("import:db");
    const writeBlocks = this.blocks.insertBlock(WithHash.new(headerHash, block));

    // Computation of the state root may happen asynchronously,
    // but we still need to wait for it before next block can be imported
    const stateRoot = await this.states.getStateRoot(this.state);
    logger.log`🧱 Storing post-state-root for ${headerHash}: ${stateRoot}.`;
    const writeStateRoot = this.blocks.setPostStateRoot(headerHash, stateRoot);

    await Promise.all([writeBlocks, writeStateRoot]);
    logger.log`${timerDb()}`;
    // finally update the best block
    await this.blocks.setBestHeaderHash(headerHash);

    // check for finality and prune old states (and optionally blocks)
    const finality = this.options.finalizer?.onBlockImported(headerHash) ?? null;
    if (finality !== null) {
      const pruneBlocks = this.options.pruneBlocks ?? false;
      this.logger
        .info`🦭 Finalized block: ${finality.finalizedHash} (${finality.prunableStateHashes.length} to prune, blocks: ${pruneBlocks})`;
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
