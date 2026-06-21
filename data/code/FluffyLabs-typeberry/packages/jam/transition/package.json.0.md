---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/package.json#L1-L34
title: packages/jam/transition/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: fbcb8fe5d7c51fd348d280a5236acef662d3b37ca789fa81bdec7696e18a560d
language: json
---
`packages/jam/transition/package.json` (lines 1–34)

```json
{
  "name": "@typeberry/transition",
  "version": "0.9.0",
  "description": "JAM state transition.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/disputes": "*",
    "@typeberry/executor": "*",
    "@typeberry/hash": "*",
    "@typeberry/jam-host-calls": "*",
    "@typeberry/logger": "*",
    "@typeberry/mmr": "*",
    "@typeberry/numbers": "*",
    "@typeberry/safrole": "*",
    "@typeberry/shuffling": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/trie": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
