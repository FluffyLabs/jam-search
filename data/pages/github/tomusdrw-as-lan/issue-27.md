---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/27'
title: Implementation of `SerializedState` with `LeafDb` backend
site: github.com/tomusdrw/as-lan
created_at: '2025-09-30T18:12:33.000Z'
last_modified: '2025-09-30T18:12:33.000Z'
content_kind: issue
---

# Implementation of `SerializedState` with `LeafDb` backend

## Issue by @tomusdrw

It would be cool to off-load state management from JS to AS. The process would be as follows:
1. We read full state blob from the DB (all trie leaves) in nodejs
2. We copy that raw data directly to WASM memory (AsssemblyScript).
3. AS creates a `SerializedState` representation that is then accessed from nodejs
4. We efficiently decode stuff (views would be nice to have as well).
5. Next we produce the state update that is passed to AS as well.
6. The state is updated and state root computed.
7. Raw blob can be stored to the database.

Pointers:
1. `LeafDb`: https://github.com/FluffyLabs/typeberry/blob/59ec0f03afd48312fc230d3eed17b25b1c9ad282/packages/jam/database/leaf-db.ts#L31
2. `stateRoot` computation: https://github.com/FluffyLabs/typeberry/blob/59ec0f03afd48312fc230d3eed17b25b1c9ad282/packages/core/trie/trie.ts#L30
3. `SerializedState`: https://github.com/FluffyLabs/typeberry/blob/59ec0f03afd48312fc230d3eed17b25b1c9ad282/packages/jam/state-merkleization/serialized-state.ts#L92
