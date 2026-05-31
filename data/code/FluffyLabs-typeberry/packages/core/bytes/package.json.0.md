---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/package.json#L1-L16
title: packages/core/bytes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 91d2d96beb27959f4b546b885c329175ae0b11cf7fdbc68bbfb614add90682b5
language: json
---
`packages/core/bytes/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/bytes",
  "version": "0.8.1",
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
