---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/expected/view_vs_collection.json#L1-L45
title: benchmarks/codec/expected/view_vs_collection.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b30987f8c32582448337e6fdba960dc8e5dec03f1885df4525358f402b7deb85
language: json
---
`benchmarks/codec/expected/view_vs_collection.json` (lines 1–45)

```json
{
  "name": "Sequence Views",
  "date": "2024-12-08T09:35:35.899Z",
  "version": null,
  "results": [
    {
      "name": "Get first element from Decoded",
      "ops": 11672.8,
      "margin": 20.0
    },
    {
      "name": "Get first element from View",
      "ops": 22729.63,
      "margin": 20.0
    },
    {
      "name": "Get 50th element from Decoded",
      "ops": 11154.33,
      "margin": 20.0
    },
    {
      "name": "Get 50th element from View",
      "ops": 14089.65,
      "margin": 20.0
    },
    {
      "name": "Get last element from Decoded",
      "ops": 11434.46,
      "margin": 20.0
    },
    {
      "name": "Get last element from View",
      "ops": 9709.62,
      "margin": 20.0
    }
  ],
  "fastest": {
    "name": "Get first element from View",
    "index": 1
  },
  "slowest": {
    "name": "Get last element from Decoded",
    "index": 4
  }
}
```
