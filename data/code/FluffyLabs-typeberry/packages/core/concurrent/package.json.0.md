---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/package.json#L1-L15
title: packages/core/concurrent/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 8609a429f8f45a1ec665c4fc392caa37509daa1b86ca0fffb11eaee47a14433b
language: json
---
`packages/core/concurrent/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/concurrent",
  "version": "0.6.0",
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
