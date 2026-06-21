---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/package.json#L1-L18
title: packages/workers/comms-authorship-network/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 40a21b43e3c7a27b68b594d56b63a1855ee2d8b5ffc3ff64a8af1a8e1d75118c
language: json
---
`packages/workers/comms-authorship-network/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/comms-authorship-network",
  "version": "0.9.0",
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
