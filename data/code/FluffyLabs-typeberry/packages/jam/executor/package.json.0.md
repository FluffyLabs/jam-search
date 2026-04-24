---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/executor/package.json#L1-L19
title: packages/jam/executor/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b3ab43fc2f374d2bba5c2cca7b50d0393b540affed72b47b49b125f44402318b
language: json
---
`packages/jam/executor/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/executor",
  "version": "0.5.11",
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
