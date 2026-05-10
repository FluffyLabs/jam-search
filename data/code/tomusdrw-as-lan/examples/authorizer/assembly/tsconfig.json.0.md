---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/authorizer/assembly/tsconfig.json#L1-L10
title: examples/authorizer/assembly/tsconfig.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 07942820688ee5b488259a052e75f8789fc9f53d8d8855c33b8486a5ef1adf97
language: json
---
`examples/authorizer/assembly/tsconfig.json` (lines 1–10)

```json
{
  "extends": "assemblyscript/std/assembly.json",
  "include": ["./**/*.ts"],
  "compilerOptions": {
    "paths": {
      "@fluffylabs/as-lan": ["../../../sdk/index.ts"],
      "@fluffylabs/as-lan/*": ["../../../sdk/*"]
    }
  }
}
```
