---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/package.json#L1-L33
title: packages/workers/importer/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 843e723d30fe1350c7a61fc4dda275c5cab49273966b6cfed7e38df711f0bfc9
language: json
---
`packages/workers/importer/package.json` (lines 1–33)

```json
{
  "name": "@typeberry/importer",
  "version": "0.9.0",
  "description": "A JAM block importer queue.",
  "main": "index.ts",
  "dependencies": {
    "@opentelemetry/api": "1.9.0",
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/ordering": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/telemetry": "*",
    "@typeberry/transition": "*",
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
