---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/jam-network/package.json#L1-L29
title: packages/workers/jam-network/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a45a0ea2512a95e8550a089a6da616938c845212bf819342a95949c778df5026
language: json
---
`packages/workers/jam-network/package.json` (lines 1–29)

```json
{
  "name": "@typeberry/jam-network",
  "version": "0.5.11",
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
