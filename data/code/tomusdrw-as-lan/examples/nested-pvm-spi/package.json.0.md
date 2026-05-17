---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/nested-pvm-spi/package.json#L1-L29
title: examples/nested-pvm-spi/package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e47f6285988210c920c3d5acec40b42fb48bd3eb4b31ef1639b220c7a5af5e29
language: json
---
`examples/nested-pvm-spi/package.json` (lines 1–29)

```json
{
  "name": "@fluffylabs/as-lan-nested-pvm-spi-example",
  "version": "0.0.1",
  "description": "Smoke-test: load the as-add.jam SPI blob and run it through NestedPvm",
  "type": "module",
  "scripts": {
    "generate-blob": "node bin/generate-blob.mjs",
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
