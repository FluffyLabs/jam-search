---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/package.json#L1-L12
title: packages/configs/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ec9bf15c7bc32014773c93300250a0c935074d93ab40153f2abb2a3dba46ae5f
language: json
---
`packages/configs/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/configs",
  "version": "0.10.0",
  "description": "A set of pre-defined JSON config files.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  }
}
```
