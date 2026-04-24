---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/317'
title: Optimize state serialization & merkleization.
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-02T15:00:58.000Z'
last_modified: '2025-04-02T15:00:58.000Z'
content_kind: issue
---

# Optimize state serialization & merkleization.

## Issue by @tomusdrw

Related: #269 

After #302 is merged, every time there is a change we serialize and merkelize the entire state.

Instead we should be able to track state changes of all `transition` functions and only re-serialize and merkleize the entries that were actually changed. This is especially important for services, since there might be a lot of them.

Most likely something to tackle before M2 / MN2.


## Comment by @tomusdrw

Related #353 


## Comment by @tomusdrw

Closed via #419
