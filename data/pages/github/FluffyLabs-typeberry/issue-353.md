---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/353'
title: Improve StatesDB implementation for better efficiency and sustainability
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-24T20:22:25.000Z'
last_modified: '2025-04-24T20:22:25.000Z'
content_kind: issue
---

# Improve StatesDB implementation for better efficiency and sustainability

## Issue by @coderabbitai[bot]

## Background

The current implementation of StatesDB is temporary and simple but has acknowledged limitations:

- Stores entire states with full keys under the state root hash
- Cannot efficiently answer CE-129 queries without storing all trie nodes
- Cannot load `SerializedState` (since it doesn't have full keys)
- Stores a lot of duplicated data

## Problem

While the current implementation has advantages (fast retrieval due to full key data, easy access to state fields), it's noted in the code comments as 'might not be sustainable' long-term.

## Suggested Alternatives

The code comments suggest multiple alternatives:

1. Store only changes to the state instead of the full state
2. Store `SerializedState` and compute the merkle trie on-demand
   - If storage is based on merkle trie keys, CE-129 queries could be answered (nomt approach)
   - If storage is more naive, it would be difficult to know what exact state needs to be merkelized when a random trie node is requested
3. Store all trie nodes with pruning of old ones (archive node approach)

## Impact

Implementing a more efficient state storage mechanism would reduce storage requirements and potentially improve performance for certain operations.

## References

- Raised in PR: #351
- Comment URL: https://github.com/FluffyLabs/typeberry/pull/351#discussion_r2059166836
- File: `packages/jam/database/states.ts`

/cc @tomusdrw


## Comment by @tomusdrw

Closed via #419 
