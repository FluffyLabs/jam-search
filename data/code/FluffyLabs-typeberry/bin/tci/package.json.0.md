---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/tci/package.json#L1-L28'
title: bin/tci/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 73636af399421837e5e9e3843a64706afcbc36ef6a96c7c2f86e9ec6349e7919
language: json
---
`bin/tci/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/tci",
  "version": "0.8.1",
  "description": "Typeberry Common Interface - Compatibility wrapper binary with flags understood by all JAM nodes",
  "main": "index.ts",
  "bin": "./index.ts",
  "scripts": {
    "start": "NODE_ENV=development tsx ./index.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/crypto": "*",
    "@typeberry/logger": "*",
    "@typeberry/node": "*",
    "@typeberry/utils": "*",
    "minimist": "1.2.8"
  },
  "devDependencies": {
    "@types/minimist": "1.2.5"
  }
}
```
