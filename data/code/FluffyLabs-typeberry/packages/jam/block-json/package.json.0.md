---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/package.json#L1-L21
title: packages/jam/block-json/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0a1c4ec9f20c1fb3b7ee5a9ca2b4843eecc1e6525bb025894cfcc8db64017db9
language: json
---
`packages/jam/block-json/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/block-json",
  "version": "0.8.1",
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
