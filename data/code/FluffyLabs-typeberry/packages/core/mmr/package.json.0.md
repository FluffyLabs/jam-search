---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/mmr/package.json#L1-L16
title: packages/core/mmr/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 512463aff88e65ca44f5571a0fd5a1276115bb6b4a323b4c593c0f32798585d6
language: json
---
`packages/core/mmr/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/mmr",
  "version": "0.11.0",
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
