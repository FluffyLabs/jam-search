---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/package.json#L1-L50'
title: bin/jam/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 060a2ed9e12103ade7c81c047c4ce86861b338cb8d2813eae25d95b999587540
language: json
---
`bin/jam/package.json` (lines 1–50)

```json
{
  "name": "@typeberry/jam",
  "version": "0.11.0",
  "description": "Typeberry - Typescript JAM implementation by Fluffy Labs team.",
  "repository": {
    "type": "git",
    "url": "https://github.com/FluffyLabs/typeberry"
  },
  "main": "index.ts",
  "bin": "./index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/networking": "*",
    "@typeberry/node": "*",
    "@typeberry/rpc": "*",
    "@typeberry/rpc-validation": "*",
    "@typeberry/numbers": "*",
    "@typeberry/safrole": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/telemetry": "*",
    "@typeberry/transition": "*",
    "@typeberry/utils": "*",
    "@typeberry/workers-api": "*",
    "@typeberry/workers-api-node": "*",
    "minimist": "1.2.8"
  },
  "scripts": {
    "start": "NODE_ENV=development NODE_OPTIONS='--max-old-space-size=7168' tsx ./index.ts",
    "inspect": "NODE_ENV=development NODE_OPTIONS='--max-old-space-size=7168' tsx --inspect ./index.ts",
    "build": "./build-for-npm.sh",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')",
    "test:e2e": "JAM_LOG=trace tsx --test test/e2e.ts",
    "tiny-network": "tsx ./helpers/tiny-network.ts"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "devDependencies": {
    "@types/minimist": "1.2.5"
  },
  "type": "module"
}
```
