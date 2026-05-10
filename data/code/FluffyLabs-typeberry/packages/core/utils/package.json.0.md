---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/package.json#L1-L12
title: packages/core/utils/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: bbcc789f6738dfb20af6e157b6f2213ea1cb439db2eb2acc5022ac41c97f9933
language: json
---
`packages/core/utils/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/utils",
  "version": "0.6.0",
  "description": "Utilities for typeberry implementation. Things don't go here lightly.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
