---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/mmr/package.json#L1-L16
title: packages/core/mmr/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9d95c22c570b5a3e2d60a513adc64a82e9e1b4319dab4a1e17b30319e494e901
language: json
---
`packages/core/mmr/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/mmr",
  "version": "0.10.0",
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
