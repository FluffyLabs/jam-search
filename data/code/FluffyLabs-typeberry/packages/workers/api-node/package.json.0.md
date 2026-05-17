---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/package.json#L1-L24
title: packages/workers/api-node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 1dbf51bac5c2c7102636ffa108110145223c9ecb5a17b2ec075a955b27478c14
language: json
---
`packages/workers/api-node/package.json` (lines 1–24)

```json
{
  "name": "@typeberry/workers-api-node",
  "version": "0.6.0",
  "description": "Node.js implementation of the workers API.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/database-lmdb": "*",
    "@typeberry/hash": "*",
    "@typeberry/listener": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*",
    "@typeberry/workers-api": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
