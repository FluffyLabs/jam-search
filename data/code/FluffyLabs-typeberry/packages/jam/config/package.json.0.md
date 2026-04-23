---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/package.json#L1-L16
title: packages/jam/config/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 51bb5f2f5aa8c3b7096d85dd107745496c46098d3ce00e55201c2c7551adc1a7
language: json
---
`packages/jam/config/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/config",
  "version": "0.5.11",
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
