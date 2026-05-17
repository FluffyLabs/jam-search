---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/package.json#L1-L20
title: packages/workers/api/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: a735353a0e8fa4e301eb26c67d881230925e1098140f5e0bfcb9fda35a1861e7
language: json
---
`packages/workers/api/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/workers-api",
  "version": "0.6.0",
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
