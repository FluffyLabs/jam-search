---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/mmr/package.json#L1-L16
title: packages/core/mmr/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9ae37c77176162e61d4e7de24390776e5cc5d0ba97929dd57c7f68abf6ba132f
language: json
---
`packages/core/mmr/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/mmr",
  "version": "0.8.1",
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
