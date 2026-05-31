---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-vectors/package.json#L1-L21
title: packages/jam/state-vectors/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6be7f4557d2d70b76552134e04419ffd0bc045cccaa3cda4ff6ab89c12429a98
language: json
---
`packages/jam/state-vectors/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/state-vectors",
  "version": "0.8.1",
  "description": "State Transition vectors.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*"
  },
  "type": "module",
  "author": "Fluffy Labs",
  "license": "MPL-2.0"
}
```
