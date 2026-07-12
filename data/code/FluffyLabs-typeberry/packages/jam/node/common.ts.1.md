---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/common.ts#L96-L112
title: packages/jam/node/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9c7a016060f5c1441a607a9337df51b6ebe936f3db1a5bfc8679f914406c7b01
language: typescript
---
`packages/jam/node/common.ts` (lines 96–112)

```typescript
  await blocks.setPostStateRoot(initialBlockHash, genesisStateRootHash);
  await blocks.setBestHeaderHash(initialBlockHash);
}

function loadGenesisState(spec: ChainSpec, blake2b: Blake2b, data: JipChainSpec["genesisState"]) {
  const stateEntries = StateEntries.fromEntriesUnsafe(data.entries());
  const state = SerializedState.fromStateEntries(spec, blake2b, stateEntries);

  const genesisStateRootHash = stateEntries.getRootHash(blake2b);
  logger.info`🧬 Genesis state root: ${genesisStateRootHash}`;

  return {
    genesisState: state,
    genesisStateSerialized: stateEntries,
    genesisStateRootHash,
  };
}
```
