---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/package.json#L1-L16
title: packages/core/bytes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e23974f120612cef7c76c0053013aed4eeb8947e25d95b8f9844739701d32587
language: json
---
`packages/core/bytes/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/bytes",
  "version": "0.10.0",
  "description": "Byte-related utilities and types.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/ordering": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
