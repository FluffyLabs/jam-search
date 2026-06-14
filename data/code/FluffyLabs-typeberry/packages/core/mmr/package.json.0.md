---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/mmr/package.json#L1-L16
title: packages/core/mmr/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 75b2a48be37f02fb8ff97ccb43d76e723c3bf250963737a146c82a20f5aeb778
language: json
---
`packages/core/mmr/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/mmr",
  "version": "0.9.0",
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
