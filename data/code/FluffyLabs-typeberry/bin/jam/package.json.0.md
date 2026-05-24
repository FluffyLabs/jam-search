---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/package.json#L1-L40'
title: bin/jam/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2420f7244e126296e25866f07235b8a47f6c7bbf474591c47693959cb564fbe0
language: json
---
`bin/jam/package.json` (lines 1–40)

```json
{
  "name": "@typeberry/jam",
  "version": "0.7.0",
  "description": "Typeberry - Typescript JAM implementation by Fluffy Labs team.",
  "repository": {
    "type": "git",
    "url": "https://github.com/FluffyLabs/typeberry"
  },
  "main": "index.ts",
  "bin": "./index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/networking": "*",
    "@typeberry/node": "*",
    "@typeberry/numbers": "*",
    "@typeberry/telemetry": "*",
    "@typeberry/utils": "*",
    "@typeberry/workers-api": "*",
    "minimist": "1.2.8"
  },
  "scripts": {
    "start": "NODE_ENV=development NODE_OPTIONS='--max-old-space-size=6144' tsx ./index.ts",
    "inspect": "NODE_ENV=development NODE_OPTIONS='--max-old-space-size=6144' tsx --inspect ./index.ts",
    "build": "./build-for-npm.sh",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')",
    "test:e2e": "JAM_LOG=trace tsx --test test/e2e.ts",
    "tiny-network": "tsx ./tiny-network.ts"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "devDependencies": {
    "@types/minimist": "1.2.5"
  },
  "type": "module"
}
```
