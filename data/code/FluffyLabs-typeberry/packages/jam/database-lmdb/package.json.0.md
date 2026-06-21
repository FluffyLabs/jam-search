---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/package.json#L1-L28
title: packages/jam/database-lmdb/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 62611fcfa2ce9d1286a424bb84d1340f4dd9328319b0cc3ee7f367e4eaf2ebe1
language: json
---
`packages/jam/database-lmdb/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/database-lmdb",
  "version": "0.9.0",
  "description": "LMDB-backed database for typeberry.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/trie": "*",
    "@typeberry/utils": "*",
    "lmdb": "3.1.3"
  },
  "type": "module"
}
```
