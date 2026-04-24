---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/package.json#L1-L15
title: packages/core/concurrent/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: aaa0b9eba11250ec980e8d35ee65084970818cc9ff3d803eddb65f3a237b6e5b
language: json
---
`packages/core/concurrent/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/concurrent",
  "version": "0.5.11",
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
