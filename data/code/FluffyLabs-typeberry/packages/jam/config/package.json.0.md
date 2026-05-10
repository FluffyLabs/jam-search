---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/package.json#L1-L16
title: packages/jam/config/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: e91f9f08e76a4cf0b3bee8bf014c629c98c7fa8d07beb37c7c4525287791fb7f
language: json
---
`packages/jam/config/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/config",
  "version": "0.6.0",
  "description": "Config for typeberry workers.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
