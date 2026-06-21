---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/expected/view_vs_materialized.json#L1-L65
title: benchmarks/codec/expected/view_vs_materialized.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 0cc40d702b014233ef02434bf3303634a2c50880c16aae83afc635ceb61e4a26
language: json
---
`benchmarks/codec/expected/view_vs_materialized.json` (lines 1–65)

```json
{
  "name": "Codec Views",
  "date": "2024-12-08T09:17:34.459Z",
  "version": null,
  "results": [
    {
      "name": "Get the first field from Decoded",
      "ops": 22564.02,
      "margin": 10
    },
    {
      "name": "Get the first field from View",
      "ops": 38693.79,
      "margin": 10
    },
    {
      "name": "Get the first field as view from View",
      "ops": 40324.46,
      "margin": 10
    },
    {
      "name": "Get two fields from Decoded",
      "ops": 179042.31,
      "margin": 10
    },
    {
      "name": "Get two fields from View",
      "ops": 35966.74,
      "margin": 10
    },
    {
      "name": "Get two fields from materialized from View",
      "ops": 73179.3,
      "margin": 10
    },
    {
      "name": "Get two fields as views from View",
      "ops": 35920.97,
      "margin": 10
    },
    {
      "name": "Get only third field from Decoded",
      "ops": 179702.84,
      "margin": 10
    },
    {
      "name": "Get only third field from View",
      "ops": 44791.97,
      "margin": 10
    },
    {
      "name": "Get only third field as view from View",
      "ops": 45399.95,
      "margin": 10
    }
  ],
  "fastest": {
    "name": "Get two fields from materialized from View",
    "index": 5
  },
  "slowest": {
    "name": "Get two fields as views from View",
    "index": 6
  }
}
```
