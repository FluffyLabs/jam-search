---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/package.json#L1-L15
title: packages/core/concurrent/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: c0e7c41d4e992b2a3a21df20f3e48a82157c01737d31e4896296abf700512457
language: json
---
`packages/core/concurrent/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/concurrent",
  "version": "0.9.0",
  "description": "Create a concurrent executor of some work.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -o -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
