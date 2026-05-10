---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/package.json#L1-L27'
title: package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e011b08d4f7950360e17d8e1f79fbccb55da264cf980d664d19654a8cd9c15f5
language: json
---
`package.json` (lines 1–27)

```json
{
  "name": "@fluffylabs/as-lan-workspace",
  "version": "0.0.4",
  "private": true,
  "description": "Workspace for developing @fluffylabs/as-lan and @fluffylabs/as-lan-ecalli-mocks",
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
    "@biomejs/biome": "^2.4.14",
    "assemblyscript": "^0.28.17"
  },
  "type": "module"
}
```
