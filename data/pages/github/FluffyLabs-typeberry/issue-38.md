---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/38'
title: >-
  Trie: Avoid re-calculating the hash when leaf node moves from left to right
  branch.
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-24T10:43:39.000Z'
last_modified: '2024-07-24T10:43:39.000Z'
content_kind: issue
---

# Trie: Avoid re-calculating the hash when leaf node moves from left to right branch.

## Issue by @tomusdrw

Introduced in:
https://github.com/FluffyLabs/typeberry/blob/ee5a6f36ae9d1ef1d01927c28833777a355d9efe/packages/trie/trie.ts#L195

Related PR: #29 

Since we are heavily optimising for minimal number of hashes, the current code needs to re-hash the leaf to restore the bit that is missing, because the leaf was store in a left subtree of a branch node.

Instead we should store the original bit/byte value somewhere and use that as a restoration mechanism.
