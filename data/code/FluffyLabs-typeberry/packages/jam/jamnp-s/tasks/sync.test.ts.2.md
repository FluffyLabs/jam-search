---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.test.ts#L258-L291
title: packages/jam/jamnp-s/tasks/sync.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 2a4a2b0a418b394bf58999d734fa4f4cda2861d3f2871843ac5c7cc917457528
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.test.ts` (lines 258–291)

```typescript
    timeSlotIndex: options.timeSlot ?? baseBlock.header.timeSlotIndex,
    priorStateRoot: options.stateRoot ?? baseBlock.header.priorStateRoot,
  });
  const block = Block.create({ ...baseBlock, header });
  const view = toBlockView(block);
  const headerHash = blake2b.hashBytes(view.header.encoded());
  return WithHash.new(headerHash.asOpaque<HeaderHash>(), block);
}

async function setupTestDatabase(inBlocks: WithHash<HeaderHash, Block>[] = []): Promise<InMemoryBlocks> {
  const db = InMemoryBlocks.new();
  let blocks = inBlocks;

  if (blocks.length === 0) {
    // Create a genesis block by default
    const genesisBlock = createTestBlock({ timeSlot: tryAsTimeSlot(0) });
    blocks = [genesisBlock];
  }

  // Insert blocks and set the last one as best
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockView = toBlockView(block.data);

    await db.insertBlock(WithHash.new(block.hash, blockView));
  }

  // Set the last block as best
  if (blocks.length > 0) {
    await db.setBestHeaderHash(blocks[blocks.length - 1].hash);
  }

  return db;
}
```
