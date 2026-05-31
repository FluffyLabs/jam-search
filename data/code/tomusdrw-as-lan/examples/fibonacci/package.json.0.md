---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/fibonacci/package.json#L1-L28
title: examples/fibonacci/package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 32c3102f073248fcce43c7f43f8a3598e2b3c63cd7f9486ef00424cd583e6e52
language: json
---
`examples/fibonacci/package.json` (lines 1–28)

```json
{
  "name": "@fluffylabs/as-lan-fibonacci-example",
  "version": "0.0.1",
  "description": "Fibonacci service example using as-lan SDK",
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
