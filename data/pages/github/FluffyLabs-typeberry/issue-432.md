---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/432'
title: Avoid constructing the trie
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-12T12:58:56.000Z'
last_modified: '2025-06-12T12:58:56.000Z'
content_kind: issue
---

# Avoid constructing the trie

## Issue by @tomusdrw


Follow up on #419 

We currently construct the trie couple of times even though it's not really needed. In reality the trie needs to be constructed ONLY to obtain the state root, and even then we don't need to store all of the intermediate nodes like we do now. We could be working just on the collection of leaf nodes instead (insertion/removal) and in case the root is needed we compute just the root hash and disregard all intermediate nodes instead of storing them


## Comment by @tomusdrw

Bumping the priority of this, because it seems that computing the state root can take up to 70ms on larger blocks 😭
