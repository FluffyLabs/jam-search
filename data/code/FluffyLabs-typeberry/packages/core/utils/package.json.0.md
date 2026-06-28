---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/package.json#L1-L12
title: packages/core/utils/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 9f6b69aaaf5bbd11ff40ece02d0d7c14676d28ab948fc1c1c2de8a4fd28a6198
language: json
---
`packages/core/utils/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/utils",
  "version": "0.9.0",
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
