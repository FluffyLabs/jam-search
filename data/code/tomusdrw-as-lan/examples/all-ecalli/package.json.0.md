---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/package.json#L1-L28
title: examples/all-ecalli/package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c3afe7bd29d0ff6026b5dd955d9a2a8b25d7b98ac37df004d1d9d6866c2e30ac
language: json
---
`examples/all-ecalli/package.json` (lines 1–28)

```json
{
  "name": "@fluffylabs/as-lan-all-ecalli-example",
  "version": "0.0.1",
  "description": "Example service that invokes all ecalli host calls in a single refine/accumulate",
  "type": "module",
  "scripts": {
    "asbuild:debug": "asc assembly/index.ts --target debug --runtime=stub",
    "asbuild:release": "asc assembly/index.ts --target release --runtime=stub",
    "asbuild:test": "asc assembly/test-run.ts --target test",
    "asbuild": "npm run asbuild:debug && npm run asbuild:release",
    "pvm": "wasm-pvm compile build/release.wasm -o build/release.pvm --adapter ../../pvm-adapter.wat",
    "build": "npm run asbuild && npm run pvm",
    "test": "npm run asbuild:test && node ./bin/test.js"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "devDependencies": {
    "@fluffylabs/as-lan": "file:../../sdk",
    "assemblyscript": "^0.28.10",
    "ecalli": "file:../../sdk-ecalli-mocks"
  },
  "exports": {
    ".": {
      "import": "./build/release.js",
      "types": "./build/release.d.ts"
    }
  }
}
```
