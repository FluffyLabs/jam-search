---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/526'
title: CE-129 Warp Sync
site: github.com/FluffyLabs/typeberry
created_at: '2025-08-01T14:08:47.000Z'
last_modified: '2025-08-01T14:08:47.000Z'
content_kind: issue
---

# CE-129 Warp Sync

## Issue by @tomusdrw

Implementation of another JAMNP-S `task`. Similar to what we currently have with the `SyncTask`.

The task consists of two parts:
- [ ] Server part - answering CE-129 state requests
- [ ] Warp Sync - when we lag behind the network significantly we should rather attempt to WarpSync instead of executing the blocks.

### Server Part
Answering CE-129 state requests should be straightforward. We already have CE-129 implementation in place, so we just need to handle querying the state database at given header hash. We might need to be able to access low-level trie nodes backend (LeafDb) to reconstruct the entire trie (in-memory) and answer the range of trie nodes user is interested in.

### Warp Sync

Warp Sync is a bit trickier, since we first need to query all the blocks between our best and the last finalized one using CE-128 (just like `SyncTask` is doing), but we shouldn't be executing them (i.e. passing to importer), but rather buffering and just verifying that they form a coherent chain (parent hashes, slots, validators handovers via `epoch_mark`).
Next (or rather in parallel) we need to query the last finalized state using CE-129. After we check that we have both, full blocks history and the state that matches the expected state root, we should batch-insert everything to the DB and update the best block we are at.
Note that during warp sync we need to disable regular sync task, since it doesn't make sense to do both.
