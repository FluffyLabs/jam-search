---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/213'
title: Extract `blake2b` and `keccak` from `@typeberry/hash`
site: github.com/FluffyLabs/typeberry
created_at: '2024-12-30T20:10:35.000Z'
last_modified: '2024-12-30T20:10:35.000Z'
content_kind: issue
---

# Extract `blake2b` and `keccak` from `@typeberry/hash`

## Issue by @tomusdrw

The hash crate should most likely stay lightweight and avoid pulling in concrete hasher implementations.

However, perhaps it's not an issue if we use `hash-wasm` consistently for all hashing (see #212) - in that case we can have `@typeberry/hash` just import `hash-wasm` and use the same implementation in the node and browser.
