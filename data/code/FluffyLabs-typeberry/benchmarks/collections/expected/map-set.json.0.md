---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/collections/expected/map-set.json#L1-L25
title: benchmarks/collections/expected/map-set.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 52657ac538edda3f3ed102b68064c02739d9d0b268db0ab218f261790354c8a2
language: json
---
`benchmarks/collections/expected/map-set.json` (lines 1–25)

```json
{
  "name": "Map: 2 gets and conditional set vs 1 get and 1 set ",
  "date": "2025-04-22T09:55:49.800Z",
  "version": null,
  "results": [
    {
      "name": "2 gets + conditional set",
      "ops": 86222.26,
      "margin": 10
    },
    {
      "name": "1 get 1 set",
      "ops": 49092.29,
      "margin": 10
    }
  ],
  "fastest": {
    "name": "2 gets + conditional set",
    "index": 0
  },
  "slowest": {
    "name": "1 get 1 set",
    "index": 1
  }
}
```
