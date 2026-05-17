---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/package.json#L1-L45'
title: sdk/package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1de79d71de305c1d3a0eb88c71b0179478a4101d07993d92b545221e6793013d
language: json
---
`sdk/package.json` (lines 1–45)

```json
{
  "name": "@fluffylabs/as-lan",
  "version": "0.0.6",
  "description": "AssemblyScript SDK for building JAM (Join-Accumulate Machine) services",
  "type": "module",
  "ascMain": "index.ts",
  "scripts": {
    "asbuild:test": "asc test/test-run.ts --target test",
    "test": "npm run asbuild:test && node ./bin/test.js",
    "prepack": "cp ../pvm-adapter.wat .",
    "postpack": "rm -f pvm-adapter.wat"
  },
  "files": [
    "index.ts",
    "core",
    "ecalli",
    "jam",
    "log-msg.ts",
    "logger.ts",
    "asconfig.json",
    "pvm-adapter.wat",
    "test",
    "bin",
    "README.md"
  ],
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tomusdrw/as-lan.git",
    "directory": "sdk"
  },
  "homepage": "https://github.com/tomusdrw/as-lan#readme",
  "bugs": {
    "url": "https://github.com/tomusdrw/as-lan/issues"
  },
  "publishConfig": {
    "access": "public",
    "provenance": true
  },
  "devDependencies": {
    "assemblyscript": "^0.28.10",
    "ecalli": "file:../sdk-ecalli-mocks"
  }
}
```
