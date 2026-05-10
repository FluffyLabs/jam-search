---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/package.json#L1-L45'
title: sdk/package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 294372de1c834d41f9f73b3e8acca3ac8286878d5252c9f268d5c69db8236109
language: json
---
`sdk/package.json` (lines 1–45)

```json
{
  "name": "@fluffylabs/as-lan",
  "version": "0.0.4",
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
