---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/tci/package.json#L1-L28'
title: bin/tci/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 31688926b7b8df67d3b0ae4c8a7ecd74cf632e985b97aa5ee0f08e1fc880a6db
language: json
---
`bin/tci/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/tci",
  "version": "0.6.0",
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
