---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/typedoc.json#L1-L18'
title: typedoc.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: c4d37b05b039cdd0d83ac6510fda39ac8a6505013f644d76714720953c4ac902
language: json
---
`typedoc.json` (lines 1–18)

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "plugin": ["typedoc-github-theme"],
  "includeVersion": true,
  "out": "./web/docs",
  "name": "Typeberry by Fluffy Labs",
  "entryPoints": ["./bin/lib/exports/*"],
  "searchInComments": true,
  "searchInDocuments": true,
  "projectDocuments": [
    "./README.md",
    "./bin/convert/README.md",
    "./bin/jam/README.md",
    "./bin/lib/README.md",
    "./bin/rpc/README.md",
    "./packages/README.md"
  ]
}
```
