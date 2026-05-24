---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/tci/package.json#L1-L28'
title: bin/tci/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 548498002a37c93862f216538e7b5150236b89e57f338ae1cf0f2575f536c3b5
language: json
---
`bin/tci/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/tci",
  "version": "0.7.0",
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
