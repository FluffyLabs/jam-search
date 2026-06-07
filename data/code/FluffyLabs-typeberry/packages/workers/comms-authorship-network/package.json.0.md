---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/package.json#L1-L18
title: packages/workers/comms-authorship-network/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b77640fa2470087eb2d3a8b89af7d5e1af1ce2d0ce4fd9160f53d43ec32857e2
language: json
---
`packages/workers/comms-authorship-network/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/comms-authorship-network",
  "version": "0.8.4",
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
