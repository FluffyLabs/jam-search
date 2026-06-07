---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/package.json#L1-L18
title: packages/core/codec/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 023b4c5b348e0e94376e19a902f33aafd71d7f5ce93c158f477a77b2ada0fe01
language: json
---
`packages/core/codec/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/codec",
  "version": "0.8.4",
  "description": "Serialization and deserialization codec for JAM.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
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
