---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/package.json#L1-L12
title: packages/configs/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a37214af3a1166b154be1bbc5eeb2653d728936d5b6b2a5243d4d44d508e0261
language: json
---
`packages/configs/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/configs",
  "version": "0.11.0",
  "description": "A set of pre-defined JSON config files.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  }
}
```
