---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.test.ts#L1-L121
title: packages/jam/jamnp-s/tasks/sync.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: eb7d9e0d4952c11ed865f0b48e5ab2045396548e9f2273d89be938f7d83c5459
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.test.ts` (lines 1–121)

```typescript
import assert, { deepEqual } from "node:assert";
import { before, describe, it } from "node:test";
import { setTimeout } from "node:timers/promises";
import {
  Block,
  type BlockView,
  Header,
  type HeaderHash,
  type HeaderView,
  type StateRootHash,
  type TimeSlot,
  tryAsTimeSlot,
} from "@typeberry/block";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { Bytes } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { InMemoryBlocks } from "@typeberry/database";
import { Blake2b, HASH_SIZE, WithHash } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { createTestPeerPair, MockNetwork } from "@typeberry/networking/testing.js";
import { setupPeerListeners } from "../network.js";
import { Connections } from "../peers.js";
import { StreamManager } from "../stream-manager.js";
import { SyncResult, SyncTask } from "./sync.js";

const logger = Logger.new(import.meta.filename, "test:net");

const spec = tinyChainSpec;

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

const toBlockView = (block: Block): BlockView => {
  const encodedBlock = Encoder.encodeObject(Block.Codec, block, spec);
  const blockView = Decoder.decodeObject(Block.Codec.View, encodedBlock, spec);
  return blockView;
};

const toHeaderView = (header: Header): HeaderView => {
  const encodedHeader = Encoder.encodeObject(Header.Codec, header, spec);
  const headerView = Decoder.decodeObject(Header.Codec.View, encodedHeader, spec);
  return headerView;
};

describe("SyncTask", () => {
  async function init(name: string, ourBlocks: WithHash<HeaderHash, Block>[] = []) {
    const network = new MockNetwork(name);
    const streamManager = new StreamManager();
    const connections = Connections.new(network);
    const blocksDb = await setupTestDatabase(ourBlocks);
    const receivedBlocks: Block[][] = [];
    const onNewBlocks = (blocks: BlockView[]) => {
      receivedBlocks.push(blocks.map((view) => view.materialize()));
    };

    const syncTask = SyncTask.start(spec, blake2b, streamManager, connections, blocksDb, onNewBlocks);

    setupPeerListeners(syncTask, network, streamManager);

    let connectionIdx = 0;
    const openConnection = (other: { name: string; network: MockNetwork }) => {
      // we need to create a pair of peers that connected together
      const [self, peer1] = createTestPeerPair(connectionIdx++, name, other.name);
      network._peers.peerConnected(peer1);
      other.network._peers.peerConnected(self);

      return [self, peer1] as const;
    };

    return {
      name,
      syncTask,
      network,
      receivedBlocks,
      connections,
      openConnection,
    };
  }

  async function tick() {
    logger.log`tick`;
    // TODO [ToDr] This is pretty imperfect. We basically need some way,
    // to let the background reading tasks to process incoming data.
    // Might be good enough? 🤷
    await setTimeout(1);
  }

  it("should maintain sync with no peers", async () => {
    // Setup
    const { syncTask } = await init("self", blocksSeq({ start: 5 }));

    const result = syncTask.maintainSync();
    deepEqual(result, {
      kind: SyncResult.NoNewBlocks,
      ours: tryAsTimeSlot(5),
      // we assume that our block is the best seen so far.
      theirs: tryAsTimeSlot(5),
    });
  });

  it("should sync with one peer", async () => {
    const self = await init("self", blocksSeq({ start: 5, end: 7 }));
    const peer1 = await init("peer1", blocksSeq({ start: 5, end: 10 }));
    self.openConnection(peer1);
    await tick();

    const resultPeer = peer1.syncTask.maintainSync();
    deepEqual(resultPeer, {
      kind: SyncResult.NoNewBlocks,
      ours: tryAsTimeSlot(10),
      // we assume that our block is the best seen so far.
      theirs: tryAsTimeSlot(10),
    });

    await tick();

    const result = self.syncTask.maintainSync();
```
