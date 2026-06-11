---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/387'
title: Block authorship worker
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-16T10:18:13.000Z'
last_modified: '2025-05-16T10:18:13.000Z'
content_kind: issue
---

# Block authorship worker

## Issue by @tomusdrw

Currently `block-generator` is not able to create new blocks that are valid, since we are verifying the seal.


The "proper" authorship module should work like that:
1. Given a collection of `Ed25519` private keys (ping @tomusdrw for how to do it, since it's already implemented in networking) should check the on-chain state and figure out which slots it should author blocks.
2. On top of that we should probably submit our tickets for the next epoch when we create blocks.


## Comment by @tomusdrw

Done in #827 
