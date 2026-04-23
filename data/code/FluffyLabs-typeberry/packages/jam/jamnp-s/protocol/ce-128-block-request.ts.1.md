---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-128-block-request.ts#L118-L230
title: packages/jam/jamnp-s/protocol/ce-128-block-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 6af989224b67f351dab674b1eddebd0c8fb5d67b627742663c93bc31567b12a7
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-128-block-request.ts` (lines 118–230)

```typescript
    if (!this.promiseResolvers.has(streamId)) {
      throw new Error("Received an unexpected message from the server.");
    }
    const blocks = Decoder.decodeSequence(Block.Codec.View, message, this.chainSpec);
    logger.log`[${streamId}] Server returned ${blocks.length} blocks in ${message.length} bytes of data.`;
    this.promiseResolvers.get(streamId)?.(blocks);
    this.promiseResolvers.delete(streamId);
  }

  onClose(streamId: StreamId) {
    this.promiseRejectors.get(streamId)?.("Stream closed.");

    this.promiseResolvers.delete(streamId);
    this.promiseRejectors.delete(streamId);
  }

  async requestBlockSequence(
    sender: StreamMessageSender,
    headerHash: HeaderHash,
    direction: Direction,
    maxBlocks: U32,
  ): Promise<BlockView[]> {
    const { streamId } = sender;
    if (this.promiseResolvers.has(streamId)) {
      throw new Error("It is disallowed to use the same stream for multiple requests.");
    }

    return new Promise((resolve, reject) => {
      this.promiseResolvers.set(streamId, resolve);
      this.promiseRejectors.set(streamId, reject);

      sender.bufferAndSend(
        Encoder.encodeObject(BlockRequest.Codec, BlockRequest.create({ headerHash, direction, maxBlocks })),
      );
      sender.close();
    });
  }
}

/** Error when querying blocks from DB. */
export enum BlockSequenceError {
  /** We don't have the start block in our db. */
  NoStartBlock = 0,
  /** When looking up the start block from the tip of the chain it wasn't found. */
  BlockOnFork = 1,
}

/** Handle request for block sequence by looking them up in the db. */
export function handleGetBlockSequence(
  chainSpec: ChainSpec,
  blocks: BlocksDb,
  startHash: HeaderHash,
  direction: Direction,
  limit: U32,
): Result<BlockView[], BlockSequenceError> {
  const getBlockView = (hash: HeaderHash): BlockView | null => {
    const header = blocks.getHeader(hash);
    const extrinsic = blocks.getExtrinsic(hash);
    if (header === null || extrinsic === null) {
      return null;
    }
    const blockView = BytesBlob.blobFromParts(header.encoded().raw, extrinsic.encoded().raw);
    return Decoder.decodeObject(Block.Codec.View, blockView, chainSpec);
  };

  const startBlock = getBlockView(startHash);
  if (startBlock === null) {
    return Result.error(
      BlockSequenceError.NoStartBlock,
      () => `Block sequence error: start block ${startHash} not found`,
    );
  }

  if (direction === Direction.AscExcl) {
    // Since we don't have an index of all blocks, we need to start from
    // the last block and reach the `startBlock`.
    const response: HeaderHash[] = [];
    const startIndex = startBlock.header.view().timeSlotIndex.materialize();
    let currentHash = blocks.getBestHeaderHash();
    for (;;) {
      const currentHeader = blocks.getHeader(currentHash);
      // some errornuous situation, we didn't really reach the block?
      if (currentHeader === null || currentHeader.timeSlotIndex.materialize() < startIndex) {
        return Result.error(
          BlockSequenceError.BlockOnFork,
          () => `Block sequence error: start block ${startHash} appears to be on a fork`,
        );
      }
      // we have everything we need, let's return it now
      if (startHash.isEqualTo(currentHash)) {
        return Result.ok(
          response
            .reverse()
            .slice(0, limit)
            .flatMap((hash) => {
              const view = getBlockView(hash);
              return view === null ? [] : [view];
            }),
        );
      }
      // otherwise include current hash in potential response and move further down.
      response.push(currentHash);
      currentHash = currentHeader.parentHeaderHash.materialize();
    }
  }

  const response = [startBlock];
  let currentBlock = startBlock;

  // now iterate a bit over ancestor blocks
  for (let i = 0; i < limit; i++) {
    const parent = getBlockView(currentBlock.header.view().parentHeaderHash.materialize());
    if (parent === null) {
```
