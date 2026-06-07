---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/package.json#L1-L12
title: packages/configs/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: eff273d73e424e973a2b81e563df04b2d9245e283fe76518c3ee581352c26050
language: json
---
`packages/configs/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/configs",
  "version": "0.8.4",
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
