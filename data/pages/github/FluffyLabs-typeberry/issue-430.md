---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/430'
title: State pruning
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-12T12:57:19.000Z'
last_modified: '2025-06-12T12:57:19.000Z'
content_kind: issue
---

# State pruning

## Issue by @tomusdrw

After #419 we store a collection of leaf nodes for each and every state.

When we have some finality (GRANDPA) information we should consider removing old states to save the disk space.

Note that the amount of pruning we can do also depends on the warp sync blocks (yet TBD) - i.e. we should store the state required for warp sync.

It might also be desirable to be able to replay some past block or to get a state proof for some past block. To support this case we might want to leave every `Nth` state in the DB, so that if someone requests state proof for `N + k` we can just replay the `k` blocks on top of `N` and have that state.


## Comment by @tomusdrw

Done
