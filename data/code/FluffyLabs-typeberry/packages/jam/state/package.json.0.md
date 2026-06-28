---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/package.json#L1-L25
title: packages/jam/state/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 13a7e4a7bbf86327818e34e6d7c920ce007b973806cdf4ec7c001909d3512002
language: json
---
`packages/jam/state/package.json` (lines 1–25)

```json
{
  "name": "@typeberry/state",
  "version": "0.9.0",
  "description": "JAM State data & types.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/mmr": "*",
    "@typeberry/numbers": "*",
    "@typeberry/ordering": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
