---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/package.json#L1-L21
title: packages/jam/block-json/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 570fa851fc6591efc4d7bd2ec622a3e7fcd9eb5524e454aba0c8faa9c42988e7
language: json
---
`packages/jam/block-json/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/block-json",
  "version": "0.8.4",
  "description": "JSON definition of block",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/collections": "*",
    "@typeberry/crypto": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
