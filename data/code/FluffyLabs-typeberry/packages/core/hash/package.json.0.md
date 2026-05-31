---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/package.json#L1-L17
title: packages/core/hash/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d3d0186428685e27bb8a020f3b00a419bcabf20c93fdcc3f72a49c959e0da63e
language: json
---
`packages/core/hash/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/hash",
  "version": "0.8.1",
  "description": "Hashing utilities for typeberry.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/utils": "*",
    "hash-wasm": "4.12.0"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
