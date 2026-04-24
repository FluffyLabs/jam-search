---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/package.json#L1-L32
title: packages/jam/in-core/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0d96f341be0d3825226f36548e35cecaed625567137028eec9291736ac8a32b3
language: json
---
`packages/jam/in-core/package.json` (lines 1–32)

```json
{
  "name": "@typeberry/in-core",
  "version": "0.5.11",
  "description": "In core execution utilities (refine phase).",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/executor": "*",
    "@typeberry/hash": "*",
    "@typeberry/jam-host-calls": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/ordering": "*",
    "@typeberry/pvm-host-calls": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/state": "*",
    "@typeberry/transition": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
