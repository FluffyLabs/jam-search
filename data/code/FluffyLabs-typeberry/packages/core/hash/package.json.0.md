---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/package.json#L1-L17
title: packages/core/hash/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8dbcd597c0da5224e29fc23d3d2e340ac657819d55f1e2ccd6ef1c66551340d6
language: json
---
`packages/core/hash/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/hash",
  "version": "0.7.0",
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
