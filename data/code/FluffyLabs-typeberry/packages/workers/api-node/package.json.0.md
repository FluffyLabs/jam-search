---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/package.json#L1-L24
title: packages/workers/api-node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 92d4eef3053f3a83971b96590f4a6b6ff1667dc60fcd8352320d960599746830
language: json
---
`packages/workers/api-node/package.json` (lines 1–24)

```json
{
  "name": "@typeberry/workers-api-node",
  "version": "0.5.11",
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
