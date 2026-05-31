---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/package.json#L1-L20
title: packages/workers/api/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 95e1474b834315be03e2d81be8b18ab1fc8e301013a0f12ab7bffd784da5dd43
language: json
---
`packages/workers/api/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/workers-api",
  "version": "0.8.1",
  "description": "Abstract workers' API utilities.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/codec": "*",
    "@typeberry/listener": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*",
    "eventemitter3": "^5.0.1"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
