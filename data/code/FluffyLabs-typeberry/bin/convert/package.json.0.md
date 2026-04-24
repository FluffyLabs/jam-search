---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/package.json#L1-L45
title: bin/convert/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7c6e748180668601a65c91da38c30028973fc6d25d6126ce80739dc6cbb35e62
language: json
---
`bin/convert/package.json` (lines 1–45)

```json
{
  "name": "@typeberry/convert",
  "version": "0.5.11",
  "description": "Convert JAM-related types between different formats.",
  "repository": {
    "type": "git",
    "url": "https://github.com/FluffyLabs/typeberry"
  },
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.js",
  "bin": "./index.js",
  "scripts": {
    "start": "NODE_ENV=development tsx ./index.ts",
    "build": "./build-for-npm.sh",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/database": "*",
    "@typeberry/fuzz-proto": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/logger": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/state": "*",
    "@typeberry/state-json": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/state-vectors": "*",
    "@typeberry/test-runner": "*",
    "@typeberry/utils": "*",
    "json-bigint-patch": "0.0.8",
    "minimist": "1.2.8"
  },
  "devDependencies": {
    "@types/minimist": "1.2.5"
  }
}
```
