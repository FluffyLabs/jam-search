---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/package.json#L1-L18
title: packages/workers/comms-authorship-network/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 78dc35a63eb790d3695ea24f5ae88ecb5659162528ec5f050d7bd8b050912b4a
language: json
---
`packages/workers/comms-authorship-network/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/comms-authorship-network",
  "version": "0.10.0",
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
