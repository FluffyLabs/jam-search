---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/394'
title: Load state from serialized keys
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-19T20:53:57.000Z'
last_modified: '2025-05-19T20:53:57.000Z'
content_kind: issue
---

# Load state from serialized keys

## Issue by @tomusdrw

Related:  https://github.com/polkadot-fellows/JIPs/pull/1

Currently we can only load state from it's full representation.

It seems thought there is now consensus to use serialized keys (the ones that go into merkle trie).

Some of the keys are possible to revert (albeit lossy), but not all of them (we won't be able to get service storage key preimages).


We either need to:
1. change the state to serialize the keys during access (i.e. when reading something we would first compute the state key and only then check what we got there)
2. Attempt to deserialize the keys (reverse the key creation process).


I'm not sure yet which approach would be good. With (1) we will most likely get a performance hit. DX-wise we could use `getters` to maintain current simplified state access. (2) sounds a bit hacky though - for instance we will still need to pre-process some of the data (for instance disregard last bytes, since they are lost anyway).
