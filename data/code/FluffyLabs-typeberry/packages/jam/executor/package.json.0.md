---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/executor/package.json#L1-L19
title: packages/jam/executor/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 2d60f94ed028e0047b2e9c28794135d264264398c98558eb532b1cc74a529cd5
language: json
---
`packages/jam/executor/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/executor",
  "version": "0.9.0",
  "description": "JAM PVM execution entry point with host calls.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/jam-host-calls": "*",
    "@typeberry/pvm-host-calls": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/pvm-interpreter": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
