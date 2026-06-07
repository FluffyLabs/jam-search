---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/package.json#L1-L28
title: packages/jam/database-lmdb/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1ad4763aea2553d1f385cd6ac89e1fa7541b44d06a4d815658e54066ca2846ac
language: json
---
`packages/jam/database-lmdb/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/database-lmdb",
  "version": "0.8.4",
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
