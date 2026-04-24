---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/package.json#L1-L28
title: packages/jam/jam-host-calls/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2d9b8c566f620048c147208912c682e323209b00633ca84d4caee336c51b5dfc
language: json
---
`packages/jam/jam-host-calls/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/jam-host-calls",
  "version": "0.5.11",
  "description": "JAM-specific host calls implementations.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/pvm-host-calls": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/state": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
