---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/package.json#L1-L14'
title: sdk/package.json
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 19e3fdd8b7bb3bbac8c4891204a31f9f0ebd4a1c5edf8e93e6b37afbf5108d62
language: json
---
`sdk/package.json` (lines 1–14)

```json
{
  "name": "@fluffylabs/as-lan",
  "version": "0.0.1",
  "type": "module",
  "ascMain": "index.ts",
  "scripts": {
    "asbuild:test": "asc test/test-run.ts --target test",
    "test": "npm run asbuild:test && node ./bin/test.js"
  },
  "devDependencies": {
    "assemblyscript": "^0.28.10",
    "ecalli": "file:../sdk-ecalli-mocks"
  }
}
```
