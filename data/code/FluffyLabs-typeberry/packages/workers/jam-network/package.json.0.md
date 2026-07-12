---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/jam-network/package.json#L1-L30
title: packages/workers/jam-network/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 08003d7d0b8f079255f4aa17e26f3bbf3082d146f907644b6a3c0a08d4ca19be
language: json
---
`packages/workers/jam-network/package.json` (lines 1–30)

```json
{
  "name": "@typeberry/jam-network",
  "version": "0.11.0",
  "description": "JAM networking worker.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/comms-authorship-network": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/jamnp-s": "*",
    "@typeberry/logger": "*",
    "@typeberry/telemetry": "*",
    "@typeberry/ticket-pool": "*",
    "@typeberry/utils": "*",
    "@typeberry/workers-api": "*",
    "@typeberry/workers-api-node": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
