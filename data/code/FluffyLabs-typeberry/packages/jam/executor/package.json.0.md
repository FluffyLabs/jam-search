---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/executor/package.json#L1-L19
title: packages/jam/executor/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3de5309a7e48922bd832c58316726051ecb356ac0f4ee36e73241e97f4b4e3b6
language: json
---
`packages/jam/executor/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/executor",
  "version": "0.8.4",
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
