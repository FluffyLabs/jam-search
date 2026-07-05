---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/package.json#L1-L17
title: packages/core/hash/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c1608946a5f73598756c3a1890db8e31812890d0a2c93d8d5fafc87cb2e3d97c
language: json
---
`packages/core/hash/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/hash",
  "version": "0.10.0",
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
