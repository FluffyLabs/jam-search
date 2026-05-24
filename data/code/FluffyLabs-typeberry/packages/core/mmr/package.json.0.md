---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/mmr/package.json#L1-L16
title: packages/core/mmr/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a1cf80f966b33c595cf810ce7ee1e2dc91cbcdf3268760dfd01bbcad7fcaeba5
language: json
---
`packages/core/mmr/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/mmr",
  "version": "0.7.0",
  "description": "Merkle Mountain Range data structure.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
