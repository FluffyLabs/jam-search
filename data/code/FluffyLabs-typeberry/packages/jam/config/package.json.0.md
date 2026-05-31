---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/package.json#L1-L16
title: packages/jam/config/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4935c72131c5f32eec54d576bb46755a1796672d12b5f508e467018a734147e7
language: json
---
`packages/jam/config/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/config",
  "version": "0.8.1",
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
