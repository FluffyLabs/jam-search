---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-vectors/package.json#L1-L21
title: packages/jam/state-vectors/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c3062d1a6846dc158b10572b50431fd7d172390eaf8215a993c0d906b3c47680
language: json
---
`packages/jam/state-vectors/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/state-vectors",
  "version": "0.5.11",
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
