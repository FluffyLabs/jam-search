---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/package.json#L1-L17
title: packages/core/hash/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2ae075183f65d2beea4beda304e291f5be1fc39a396957aae4251d7e53224fd1
language: json
---
`packages/core/hash/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/hash",
  "version": "0.8.4",
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
