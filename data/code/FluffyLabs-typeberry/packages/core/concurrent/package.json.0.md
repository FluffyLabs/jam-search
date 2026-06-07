---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/package.json#L1-L15
title: packages/core/concurrent/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 878ffc137745c9873cd61c9dcb10f71d487687893d44e18ef9b7078be92968f8
language: json
---
`packages/core/concurrent/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/concurrent",
  "version": "0.8.4",
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
