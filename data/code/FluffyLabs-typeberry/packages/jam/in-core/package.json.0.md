---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/package.json#L1-L33
title: packages/jam/in-core/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a9e6662751677113c9ecc9992375de30f0339c75c7e76553e7bbb96703ae4dae
language: json
---
`packages/jam/in-core/package.json` (lines 1–33)

```json
{
  "name": "@typeberry/in-core",
  "version": "0.11.0",
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
    "@typeberry/merkleization": "*",
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
