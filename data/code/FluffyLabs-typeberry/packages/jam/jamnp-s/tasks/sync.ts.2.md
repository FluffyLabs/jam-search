---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.ts#L226-L331
title: packages/jam/jamnp-s/tasks/sync.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 4
content_sha: 99a8821d7c758d4c262521147049d570d94b9b695db6402766a5fb46023daa89
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.ts` (lines 226–331)

```typescript
    const peers = this.connections.getConnectedPeers();
    for (const peerInfo of peers) {
      this.streamManager.withStreamOfKind<up0.Handler>(peerInfo.peerId, up0.STREAM_KIND, (handler, sender) => {
        logger.log`[${peerInfo.peerId}] <-- Broadcasting new header #${slot}: ${header.hash}`;
        handler.sendAnnouncement(sender, annoucement);
        return OK;
      });
    }
  }

  private handleGetBlockSequence(
    peer: Peer,
    startHash: HeaderHash,
    direction: ce128.Direction,
    maxBlocks: U32,
  ): BlockView[] {
    const limit = tryAsU32(Math.min(maxBlocks, MAX_BLOCK_SEQUENCE));
    const res = handleGetBlockSequence(this.spec, this.blocks, startHash, direction, limit);
    if (res.isOk) {
      return res.ok;
    }

    if (res.error === BlockSequenceError.BlockOnFork) {
      // seems that peer is requesting syncing a fork from us, let's bail.
      logger.warn`[${peer.id}] --> Invalid block sequence request: ${startHash} is on a fork.`;
      return [];
    }

    if (res.error === BlockSequenceError.NoStartBlock) {
      // we don't know about that block at all, so let's just bail.
      // we should probably penalize the peer for sending BS?
      logger.warn`[${peer.id}] --> Invalid block sequence request: ${startHash} missing header or extrinsic.`;
      return [];
    }

    assertNever(res.error);
  }

  /** Should be called periodically to request best seen blocks from other peers. */
  maintainSync() {
    // figure out where we are at
    const ourBestHash = this.blocks.getBestHeaderHash();
    const ourBestHeader = this.blocks.getHeader(ourBestHash);
    const peerCount = this.connections.getPeerCount();
    if (ourBestHeader === null) {
      return {
        kind: SyncResult.OurBestHeaderMissing,
      };
    }

    const ourBestSlot = ourBestHeader.timeSlotIndex.materialize();
    // figure out where others are at
    const othersBest = this.othersBest;
    const blocksToSync = othersBest.slot - ourBestSlot;

    logger.trace`Our best. ${ourBestSlot}. Best seen: ${othersBest.slot}`;
    if (blocksToSync < 1) {
      this.connections.getPeerCount();
      logger.trace`No new blocks. ${peerCount} peers.`;
      return {
        kind: SyncResult.NoNewBlocks,
        ours: ourBestSlot,
        theirs: othersBest.slot,
      };
    }

    const requested: RequestedBlocks[] = [];

    logger.log`Sync ${blocksToSync} blocks from ${peerCount} peers.`;
    // NOTE [ToDr] We might be requesting the same blocks from many peers
    // which isn't very optimal, but for now: 🤷
    //
    // find peers that might have that block
    for (const peerInfo of this.connections.getConnectedPeers()) {
      const auxData = this.connections.getAuxData(peerInfo.peerId, SYNC_AUX);
      // no aux data for that peer or peer not connected?
      if (auxData === undefined || peerInfo.peerRef === null) {
        continue;
      }

      const bestSlot = auxData.bestHeader !== null ? auxData.bestHeader.data.timeSlotIndex : auxData.finalBlockSlot;
      const bestHash = auxData.bestHeader !== null ? auxData.bestHeader.hash : auxData.finalBlockHash;
      // the peer doesn't have anything new for us
      if (bestSlot <= ourBestSlot) {
        continue;
      }

      // add some details for statistics.
      requested.push({
        peerId: peerInfo.peerId,
        theirs: bestSlot,
        count: bestSlot - ourBestSlot,
      });

      // request as much blocks from that peer as possible.
      this.streamManager.withNewStream<ce128.ClientHandler>(peerInfo.peerRef, ce128.STREAM_KIND, (handler, sender) => {
        handleAsyncErrors(
          async () => {
            logger.log`[${peerInfo.peerId}] <-- Fetching ${bestSlot - ourBestSlot} blocks (${bestHash})`;
            const blocks = await handler.requestBlockSequence(
              sender,
              bestHash,
              ce128.Direction.DescIncl,
              tryAsU32(bestSlot - ourBestSlot),
            );
            blocks.reverse();
```
