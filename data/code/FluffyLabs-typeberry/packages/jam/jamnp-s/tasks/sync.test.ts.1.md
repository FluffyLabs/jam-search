---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.test.ts#L114-L262
title: packages/jam/jamnp-s/tasks/sync.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: 1a487a2e8a6b62704ce75b05c44baf5fec87099b52901977c06dd122e3114ea0
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.test.ts` (lines 114–262)

```typescript
      ours: tryAsTimeSlot(10),
      // we assume that our block is the best seen so far.
      theirs: tryAsTimeSlot(10),
    });

    await tick();

    const result = self.syncTask.maintainSync();
    deepEqual(result, {
      kind: SyncResult.BlocksRequested,
      ours: tryAsTimeSlot(7),
      requested: [
        {
          count: 3,
          peerId: "peer1",
          theirs: 10,
        },
      ],
    });

    await tick();

    deepEqual(
      self.receivedBlocks[0].map((x) => x.header.timeSlotIndex),
      [7, 8, 9, 10],
    );
  });

  it("should sync with multiple peers", async () => {
    const self = await init("self", blocksSeq({ start: 5, end: 7 }));
    const peer1 = await init("peer1", blocksSeq({ start: 5, end: 10 }));
    const peer2 = await init("peer2", blocksSeq({ start: 5, end: 12 }));
    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    const resultSelf = self.syncTask.maintainSync();
    deepEqual(resultSelf, {
      kind: SyncResult.BlocksRequested,
      ours: tryAsTimeSlot(7),
      requested: [
        {
          count: 3,
          peerId: "peer1",
          theirs: 10,
        },
        {
          count: 5,
          peerId: "peer2",
          theirs: 12,
        },
      ],
    });

    await tick();

    deepEqual(
      self.receivedBlocks.map((chunk) => chunk.map((block) => block.header.timeSlotIndex)),
      [
        [7, 8, 9, 10],
        [7, 8, 9, 10, 11, 12],
      ],
    );
  });

  it("should broadcast our header to one connected peers", async () => {
    await broadcastTest(1);
  });

  it("should broadcast our header to two connected peers", async () => {
    await broadcastTest(2);
  });

  it("should broadcast our header to multiple connected peers", async () => {
    await broadcastTest(10);
  });

  async function broadcastTest(peersCount: number) {
    const blocks = blocksSeq({ start: 0, end: 1 });
    const newBlock = blocks.pop();
    assert.ok(newBlock !== undefined);

    const self = await init("self", blocks);
    const peers = await Promise.all(
      Array.from({ length: peersCount }).map((_v, id) => {
        return init(`peer${id}`, blocks);
      }),
    );

    for (const p of peers) {
      self.openConnection(p);
    }
    await tick();

    for (const p of peers) {
      deepEqual(p.syncTask.maintainSync().kind, SyncResult.NoNewBlocks);
    }

    // Send broadcast
    self.syncTask.broadcastHeader(WithHash.new(newBlock.hash, toHeaderView(newBlock.data.header)));
    await tick();

    for (const p of peers) {
      deepEqual(p.syncTask.maintainSync(), {
        kind: SyncResult.BlocksRequested,
        ours: tryAsTimeSlot(0),
        requested: [
          {
            count: 1,
            peerId: "self",
            theirs: tryAsTimeSlot(1),
          },
        ],
      });
    }
  }
});

function blocksSeq({ start, end = start }: { start: number; end?: number }) {
  if (start > end) {
    throw new Error(`No blocks to create: ${start} > ${end}`);
  }

  const blocks: WithHash<HeaderHash, Block>[] = [];
  for (let i = start; i <= end; i++) {
    const prev = blocks.length > 0 ? blocks[blocks.length - 1] : null;
    const parentHash = prev?.hash ?? Bytes.zero(HASH_SIZE).asOpaque();
    blocks.push(
      createTestBlock({
        parentHash,
        timeSlot: tryAsTimeSlot(i),
      }),
    );
  }
  return blocks;
}

function createTestBlock(
  options: { parentHash?: HeaderHash; timeSlot?: TimeSlot; stateRoot?: StateRootHash } = {},
): WithHash<HeaderHash, Block> {
  const baseBlock = testBlockView().materialize();
  const header = Header.create({
    ...baseBlock.header,
    parentHeaderHash: options.parentHash ?? baseBlock.header.parentHeaderHash,
    timeSlotIndex: options.timeSlot ?? baseBlock.header.timeSlotIndex,
    priorStateRoot: options.stateRoot ?? baseBlock.header.priorStateRoot,
  });
  const block = Block.create({ ...baseBlock, header });
  const view = toBlockView(block);
```
