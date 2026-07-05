---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-vectors/package.json#L1-L21
title: packages/jam/state-vectors/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9a24082acf09c9b907d53c5b015281e9290a31ed19a8212128c2c3c85a562eb7
language: json
---
`packages/jam/state-vectors/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/state-vectors",
  "version": "0.10.0",
  "description": "State Transition vectors.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*"
  },
  "type": "module",
  "author": "Fluffy Labs",
  "license": "MPL-2.0"
}
```
