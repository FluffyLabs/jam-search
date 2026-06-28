---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/index.ts#L1-L34
title: packages/jam/state-merkleization/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 37d832ecfddcf5762a8af67e524a03033059952d268d3ab05398a94752981a1c
language: typescript
---
`packages/jam/state-merkleization/index.ts` (lines 1–34)

```typescript
/**
 * JAM State Serialization & Merkleization.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/389f00389f00
 *
 * State representations:
 *
 * We maintain two "views" of our chain state:
 *
 * - **InMemoryState**
 *   - Full, canonical state held entirely in memory.
 *   - Complete info on every field, plus lists of services, modules, etc.
 *
 * - **SerializedState<T>**
 *   - Generic wrapper around a serialized snapshot of the state.
 *   - Only the bytes (and minimal metadata) are held up front.
 *   - Three instantiations:
 *     - `SerializedState<Persistence>`: Pure "black-box" serialized blob
 *        (incomplete in-memory view).
 *     - `SerializedState<LeafDb>`: Disk-backed trie storage-leaf nodes live on
 *        disk and load on demand; cheap to update (no data duplication) and re-compute
 *        the `stateRoot`. Used in LMDB.
 *     - `SerializedState<StateEntries>`: serialized state represented as a simple in-memory
 *        hashmap of `key -> value` entries.
 */

export * from "./binary-merkleization.js";
export * from "./keys.js";
export * from "./loader.js";
export * from "./serialize.js";
export * from "./serialize-state-update.js";
export * from "./serialized-state.js";
export * from "./serialized-state-view.js";
export * from "./state-entries.js";
```
