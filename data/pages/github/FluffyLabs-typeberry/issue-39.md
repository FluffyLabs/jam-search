---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/39'
title: 'Trie: Batch set / Lazy trie'
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-24T10:48:47.000Z'
last_modified: '2024-07-24T10:48:47.000Z'
content_kind: issue
---

# Trie: Batch set / Lazy trie

## Issue by @tomusdrw

Related PR: #29 

Currently the trie updates it's merkle root every time we insert even a single leaf. This is going to be sub-optimal in case we want to insert multiple nodes at once (which is going to be a real-world use case).

The issue is to figure out how to do batch updates on the trie that avoids excessive hashing.

One idea that I had in mind is to introduce a "lazy trie" structure, where we store the left/right subtrees of a branch node, but without actually knowing it's hash. Thanks to this inserting leafs is cheaper, since we just make sure that we have correct intermediate nodes stubs in place, but without actually knowing their exact byte representation and then we can just fill out their byte representation only when the merkle trie root is calculated.

Note that it also means we need to defer adding all of the nodes to the `NodesDb` and just do it once at the very end.


## Comment by @tomusdrw

Closed in favor of #87
The trie should rather be an ephemeral structure stored only on disk. The current trie implementation should stay though in case we need it to store small amount of data (fitting in the memory) and have the merkle root be readily available. The current one will also be useful for the visualisation.
