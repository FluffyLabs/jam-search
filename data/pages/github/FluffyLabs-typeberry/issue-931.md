---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/931'
title: 'Block pruning: values DB leaks memory (ref-counting not implemented)'
site: github.com/FluffyLabs/typeberry
created_at: '2026-03-17T12:26:23.000Z'
last_modified: '2026-03-17T12:26:23.000Z'
content_kind: issue
---

# Block pruning: values DB leaks memory (ref-counting not implemented)

## Issue by @coderabbitai[bot]

## Summary

During block pruning (introduced in #930), `BlocksDb` and `StatesDb` are pruned as a sliding window, but the **values DB is never cleared**, causing a memory leak over long-running fuzzer sessions.

## Root cause

In `packages/jam/database/serialized-states-db.ts`, `InMemorySerializedStates` holds a shared `valuesDb`:

```ts
// packages/jam/database/serialized-states-db.ts
private readonly valuesDb: HashDictionary<ValueHash, BytesBlob> = HashDictionary.new();
```

Values (large leaf node payloads) are inserted into this map on every state update:

```ts
for (const val of values) {
  this.valuesDb.set(val[0], val[1]);
}
```

However, when a state is pruned via `markUnused`, entries in `valuesDb` are **never removed**. The map grows unboundedly.

## Why it's hard to fix

Removing a value is only safe when **no remaining leaf node in any retained state** still references it. This requires ref-counting across states. There is already a related TODO in the leaf update logic:

```ts
// packages/jam/database/leaf-db-update.ts (line 30)
// TODO [ToDr] Handle ref-counting values or updating some header-hash-based references.
```

## Suggested fix

Implement ref-counting in `valuesDb`:
- Increment a ref-count when a value hash is written to a new leaf node.
- Decrement the ref-count (and delete the entry) when a leaf node is removed or when a state that references the value is pruned.

## Impact

The leak is bounded in practice by the rate of new large values being written, but for long-running fuzzer sessions it can accumulate significantly.

---

_Reported from PR #930 (https://github.com/FluffyLabs/typeberry/pull/930). Requested by @tomusdrw._
