---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/package.json#L1-L27
title: packages/jam/state-json/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b52558b4433096150ec7c6fc6e8e9cf7b4601263c53f992bc1584e55cb025c12
language: json
---
`packages/jam/state-json/package.json` (lines 1–27)

```json
{
  "name": "@typeberry/state-json",
  "version": "0.11.0",
  "description": "Utilities to parse JSON state.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/numbers": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/utils": "*"
  }
}
```
