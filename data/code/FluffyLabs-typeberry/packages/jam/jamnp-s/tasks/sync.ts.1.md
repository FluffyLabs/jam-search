---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.ts#L113-L228
title: packages/jam/jamnp-s/tasks/sync.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 16725655d56ca79478213c82ebcb04ee1c9cab553056a6fe274030f7a4a29330
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.ts` (lines 113–228)

```typescript
      throw new Error(`Best header ${ourBestHash} missing in the database?`);
    }
    this.othersBest = up0.HashAndSlot.create({
      hash: ourBestHash,
      slot: ourBestBlock.timeSlotIndex.materialize(),
    });
  }

  private onUp0Handshake(peer: Peer, handshake: up0.Handshake) {
    const { hash, slot } = handshake.final;
    this.connections.withAuxData(peer.id, SYNC_AUX, (aux) => {
      if (aux === undefined) {
        return {
          finalBlockHash: hash,
          finalBlockSlot: slot,
          bestHeader: null,
        };
      }

      aux.finalBlockHash = hash;
      aux.finalBlockSlot = slot;
      aux.bestHeader = null;
      return aux;
    });

    if (this.othersBest.slot < slot) {
      this.othersBest = handshake.final;
    }
  }

  private onUp0Annoucement(peer: Peer, announcement: up0.Announcement) {
    const { hash, slot } = announcement.final;
    const bestHeader = hashHeader(this.blake2b, announcement.header, this.spec);
    logger.info`[${peer.id}] --> Received new header #${announcement.header.timeSlotIndex}: ${bestHeader.hash}`;

    // NOTE [ToDr] Instead of having `Connections` store aux data perhaps
    // we should maintain that directly? However that would require
    // listening to peers connected/disconnected to perfrom some cleanups
    // and extra persistence.
    //
    // update the peer info
    this.connections.withAuxData(peer.id, SYNC_AUX, (aux) => {
      if (aux === undefined) {
        return {
          finalBlockHash: hash,
          finalBlockSlot: slot,
          bestHeader,
        };
      }

      aux.finalBlockHash = hash;
      aux.finalBlockSlot = slot;
      aux.bestHeader = bestHeader;
      return aux;
    });

    // TODO [ToDr] This should take finality into account, which would
    // also indirectly do ancestry checks (i.e. we assume that the peer
    // is verifying that the best block is built on top of it's own
    // reported finalized block).
    //
    // now check if we should sync that block
    if (this.othersBest.slot < bestHeader.data.timeSlotIndex) {
      this.othersBest = up0.HashAndSlot.create({
        hash: bestHeader.hash,
        slot: bestHeader.data.timeSlotIndex,
      });
    }
  }

  private getUp0Handshake(): up0.Handshake {
    // TODO [ToDr] We don't have finality yet,
    // we just treat each produced block as instantly-finalized.
    const bestBlockHash = this.blocks.getBestHeaderHash();
    const bestHeader = this.blocks.getHeader(bestBlockHash);
    const timeSlot = bestHeader?.timeSlotIndex.materialize();
    const bestBlock = up0.HashAndSlot.create({
      hash: bestBlockHash,
      slot: timeSlot ?? tryAsTimeSlot(0),
    });

    return up0.Handshake.create({
      final: bestBlock,
      leafs: [],
    });
  }

  /**
   * Open a UP0 stream with given peer.
   *
   * This will automatically send a handshake as well.
   */
  openUp0(peer: Peer) {
    this.streamManager.withNewStream<up0.Handler>(peer, up0.STREAM_KIND, (handler, sender) => {
      handler.sendHandshake(sender);
      return OK;
    });
  }

  /** Broadcast header we have seen or produced to our peers. */
  // TODO [ToDr] consider returning promise for backpressure
  broadcastHeader(header: WithHash<HeaderHash, HeaderView>) {
    const slot = header.data.timeSlotIndex.materialize();
    const annoucement = up0.Announcement.create({
      header: header.data.materialize(),
      final: up0.HashAndSlot.create({
        hash: header.hash,
        slot,
      }),
    });
    // TODO [ToDr] we currently gossip to everyone, but we probably should:
    // 1. Gossip to peers in batches (sqrt(n) peers first?)
    // 2. Gossip only to the peers that don't know about that header yet.
    const peers = this.connections.getConnectedPeers();
    for (const peerInfo of peers) {
      this.streamManager.withStreamOfKind<up0.Handler>(peerInfo.peerId, up0.STREAM_KIND, (handler, sender) => {
```
