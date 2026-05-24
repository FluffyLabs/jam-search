---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/package.json#L1-L16
title: packages/jam/config/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8f4e8b50584020d869cf28e588f1a6b1e111f0a348ba8d1e49ef418b151dd6c1
language: json
---
`packages/jam/config/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/config",
  "version": "0.7.0",
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
