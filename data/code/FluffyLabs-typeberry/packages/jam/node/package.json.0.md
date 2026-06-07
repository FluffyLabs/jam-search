---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/package.json#L1-L40
title: packages/jam/node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c7138a84c4c38512ec4b4c0445052d16df9a521250a29fd98d5d25d398ed4602
language: json
---
`packages/jam/node/package.json` (lines 1–40)

```json
{
  "name": "@typeberry/node",
  "version": "0.8.4",
  "description": "The main typeberry node.",
  "main": "index.ts",
  "dependencies": {
    "@opentelemetry/api": "1.9.0",
    "@typeberry/block": "*",
    "@typeberry/block-authorship": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/comms-authorship-network": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/configs": "*",
    "@typeberry/crypto": "*",
    "@typeberry/ext-ipc": "*",
    "@typeberry/fuzz-proto": "*",
    "@typeberry/hash": "*",
    "@typeberry/importer": "*",
    "@typeberry/jam-network": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/listener": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/state-json": "*",
    "@typeberry/state-merkleization": "*",
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
