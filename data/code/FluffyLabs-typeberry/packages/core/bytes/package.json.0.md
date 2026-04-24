---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/package.json#L1-L16
title: packages/core/bytes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2ed4fa8988f12cfd2eee34d47589ce9c15c81e94925bc366633132d36b749a29
language: json
---
`packages/core/bytes/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/bytes",
  "version": "0.5.11",
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
