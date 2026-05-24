---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/package.json#L1-L17
title: packages/core/pvm-interface/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 69ee650c8faa6cb2def3fcd4473030b8ccd4f7fd1f074b58916ba3655898e650
language: json
---
`packages/core/pvm-interface/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/pvm-interface",
  "version": "0.7.0",
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
