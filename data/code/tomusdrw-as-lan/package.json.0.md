---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/package.json#L1-L26'
title: package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: a4085a2036d07d727061416cff8efe8aadc3233913aec554034c7302ff66ff35
language: json
---
`package.json` (lines 1–26)

```json
{
  "name": "@fluffylabs/as-lan",
  "version": "0.0.1",
  "description": "AssemblyScript SDK for JAM services",
  "main": "index.ts",
  "scripts": {
    "format": "biome format --write",
    "lint": "biome lint --write; biome check --write",
    "qa": "biome ci",
    "qa-fix": "npm run format; npm run lint",
    "build:sdk-ecalli-mocks": "cd sdk-ecalli-mocks && npm install && npm run build",
    "sdk:test": "cd sdk && npm install && npm test",
    "example:build": "for d in examples/*/; do (cd \"$d\" && npm install && npm run build) || exit 1; done",
    "example:test": "for d in examples/*/; do (cd \"$d\" && npm install && npm test) || exit 1; done",
    "build": "npm run build:sdk-ecalli-mocks && npm run example:build",
    "test": "npm run build:sdk-ecalli-mocks && npm run sdk:test && npm run example:test",
    "prepare": "git config core.hooksPath .githooks"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "devDependencies": {
    "@biomejs/biome": "^2.4.12",
    "assemblyscript": "^0.28.14"
  },
  "type": "module"
}
```
