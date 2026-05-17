---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/package.json#L1-L18
title: packages/workers/comms-authorship-network/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 3f11e9bb56e742bc01c1f3323b17b6672323b1776375d29d6119c55e0ba73c03
language: json
---
`packages/workers/comms-authorship-network/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/comms-authorship-network",
  "version": "0.6.0",
  "description": "The communication layer between the block authorship and network workers.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/codec": "*",
    "@typeberry/utils": "*",
    "@typeberry/workers-api": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
