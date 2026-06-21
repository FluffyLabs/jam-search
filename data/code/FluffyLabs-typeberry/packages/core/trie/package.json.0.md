---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/package.json#L1-L18
title: packages/core/trie/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 8b3cc977bbda83c1463995af5b1400dcc7efde2e48b09ff9572fd47656c7f652
language: json
---
`packages/core/trie/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/trie",
  "version": "0.9.0",
  "description": "Trie implementation for Typeberry JAM.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/collections": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
