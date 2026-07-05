---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/package.json#L1-L17
title: packages/core/pvm-interface/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ba48b6a8ea6296d4e07b1231927f4e61a2df52365d44f7d6ba96334ed12ee8b1
language: json
---
`packages/core/pvm-interface/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/pvm-interface",
  "version": "0.10.0",
  "description": "A PVM interface for external implementations.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "start": "tsx ./bin.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
