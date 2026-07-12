---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/collections/expected/map-set.json#L1-L25
title: benchmarks/collections/expected/map-set.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 58114e6c46a63668cba1f9667ef8e9e8f06fcedbb24362c03e7d5c12b5e73cbf
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
      "ops": 46992.12,
      "margin": 2.0
    },
    {
      "name": "1 get 1 set",
      "ops": 37868.19,
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
