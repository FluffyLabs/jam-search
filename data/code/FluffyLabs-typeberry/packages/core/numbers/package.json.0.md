---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/package.json#L1-L15
title: packages/core/numbers/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0ab01912c75ceabd8e42ee84a53c76da89b9b6f7f6d0c64e08dcf77ff4c630b4
language: json
---
`packages/core/numbers/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/numbers",
  "version": "0.7.0",
  "description": "Number types for typeberry data structures.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -o -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
