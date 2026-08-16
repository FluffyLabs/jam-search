---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/package.json#L1-L16
title: packages/core/bytes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3a1a2879ee172d075c7fca027030088cfca7a295102d76faad30f6569cb5f932
language: json
---
`packages/core/bytes/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/bytes",
  "version": "0.11.0",
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
