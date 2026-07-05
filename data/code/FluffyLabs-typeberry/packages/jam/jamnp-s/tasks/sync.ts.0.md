---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.ts#L1-L120
title: packages/jam/jamnp-s/tasks/sync.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 3faafc328b3ad6794ded67a2e981464139f4ad2de6c16d4afcd3d433a4a0c6f4
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.ts` (lines 1–120)

```typescript
import {
  type BlockView,
  Header,
  type HeaderHash,
  type HeaderView,
  type TimeSlot,
  tryAsTimeSlot,
} from "@typeberry/block";
import { Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import type { BlocksDb } from "@typeberry/database";
import { type Blake2b, WithHash } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import type { Peer, PeerId } from "@typeberry/networking";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { assertNever, OK } from "@typeberry/utils";
import type { AuxData, Connections } from "../peers.js";
import { BlockSequenceError, handleGetBlockSequence } from "../protocol/ce-128-block-request.js";
import { ce128, type StreamId, up0 } from "../protocol/index.js";
import type { StreamManager } from "../stream-manager.js";
import { handleAsyncErrors } from "../utils.js";

export const SYNC_AUX: AuxData<SyncAux> = {
  id: Symbol("sync"),
};

type SyncAux = {
  finalBlockHash: HeaderHash;
  finalBlockSlot: TimeSlot;
  bestHeader: WithHash<HeaderHash, Header> | null;
};

const logger = Logger.new(import.meta.filename, "net:sync");

/**
 * Maximal number of blocks we will send as a response to CE128.
 */
const MAX_BLOCK_SEQUENCE = 128;

export class SyncTask {
  static start(
    spec: ChainSpec,
    blake2b: Blake2b,
    streamManager: StreamManager,
    connections: Connections,
    blocks: BlocksDb,
    // TODO [ToDr] Use listener instead of a callback maybe?
    onNewBlocks: (blocks: BlockView[], peerId: PeerId) => void,
  ) {
    const syncTask = new SyncTask(spec, blake2b, streamManager, connections, blocks, onNewBlocks);

    const getPeerForStream = (streamId: StreamId) => {
      // NOTE [ToDr] Needing to query stream manager for a peer might be a bit
      // wasteful, since we probably know the peer when we dispatch the
      // stream message, however it's nice that the current abstraction of
      // streams does not know anything about peers. Revisit if it gets ugly.

      // retrieve a peer for that stream
      return streamManager.getPeer(streamId);
    };

    const up0Handler = up0.Handler.new(
      spec,
      () => syncTask.getUp0Handshake(),
      (streamId, ann) => {
        const peer = getPeerForStream(streamId);
        if (peer !== null) {
          syncTask.onUp0Annoucement(peer, ann);
        }
      },
      (streamId, handshake) => {
        const peer = getPeerForStream(streamId);
        if (peer !== null) {
          syncTask.onUp0Handshake(peer, handshake);
        }
      },
    );

    // server mode
    streamManager.registerIncomingHandlers(up0Handler);
    streamManager.registerIncomingHandlers(
      ce128.ServerHandler.new(spec, (streamId, hash, direction, maxBlocks) => {
        const peer = streamManager.getPeer(streamId);
        if (peer !== null) {
          return syncTask.handleGetBlockSequence(peer, hash, direction, maxBlocks);
        }
        return [];
      }),
    );

    // client mode
    streamManager.registerOutgoingHandlers(up0Handler);
    streamManager.registerOutgoingHandlers(ce128.ClientHandler.new(spec));

    return syncTask;
  }

  // Other's best header hash with timeslot
  private othersBest: up0.HashAndSlot;

  private constructor(
    private readonly spec: ChainSpec,
    private readonly blake2b: Blake2b,
    private readonly streamManager: StreamManager,
    private readonly connections: Connections,
    private readonly blocks: BlocksDb,
    private readonly onNewBlocks: (blocks: BlockView[], peer: PeerId) => void,
  ) {
    const ourBestHash = blocks.getBestHeaderHash();
    // Get best block view
    const ourBestBlock = blocks.getHeader(ourBestHash);
    if (ourBestBlock === null) {
      throw new Error(`Best header ${ourBestHash} missing in the database?`);
    }
    this.othersBest = up0.HashAndSlot.create({
      hash: ourBestHash,
      slot: ourBestBlock.timeSlotIndex.materialize(),
    });
  }

```
