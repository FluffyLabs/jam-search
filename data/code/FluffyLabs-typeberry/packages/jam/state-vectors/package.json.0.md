---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-vectors/package.json#L1-L21
title: packages/jam/state-vectors/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 8c8f10f1a496726a80568d3de008638be15f2c7ba78db20c790bfbfca6b1f8e4
language: json
---
`packages/jam/state-vectors/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/state-vectors",
  "version": "0.6.0",
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
