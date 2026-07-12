---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/package.json#L1-L25
title: packages/workers/api-node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 431c5499cd907114294da9009337040dd88966130beaff2de3bb27372a617479
language: json
---
`packages/workers/api-node/package.json` (lines 1–25)

```json
{
  "name": "@typeberry/workers-api-node",
  "version": "0.11.0",
  "description": "Node.js implementation of the workers API.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/database-fjall": "*",
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
