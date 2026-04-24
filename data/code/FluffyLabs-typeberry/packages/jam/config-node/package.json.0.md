---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/package.json#L1-L22
title: packages/jam/config-node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cd4cc23be4a16457d6e8c3692733bfe0aaa11167bfaf1907b0cd687ce8d13776
language: json
---
`packages/jam/config-node/package.json` (lines 1–22)

```json
{
  "name": "@typeberry/config-node",
  "version": "0.5.11",
  "description": "Config for typeberry node.",
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/config": "*",
    "@typeberry/configs": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0"
}
```
