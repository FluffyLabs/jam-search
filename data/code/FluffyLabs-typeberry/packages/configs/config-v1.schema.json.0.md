---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/config-v1.schema.json#L1-L48
title: packages/configs/config-v1.schema.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f00e16f2ed0fbe4939559eeb0f34e02111076351cabb98af3b1e549171477f7b
language: json
---
`packages/configs/config-v1.schema.json` (lines 1–48)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Typeberry Configuration - v1",
  "description": "Configuration schema for Typeberry blockchain node",
  "type": "object",
  "required": ["$schema", "version", "flavor", "chain_spec", "authorship"],
  "properties": {
    "version": {
      "type": "number",
      "description": "Version of the configuration file.",
      "const": 1
    },
    "flavor": {
      "type": "string",
      "description": "The flavor/variant of the configuration",
      "examples": ["tiny", "full"]
    },
    "chain_spec": {
      "$ref": "./specs/jip4.schema.json"
    },
    "database_base_path": {
      "type": "string",
      "description": "Base path for blockchain database storage",
      "minLength": 1,
      "examples": ["./database"]
    },
    "state_backend": {
      "type": "string",
      "description": "Persistent database backend used when database_base_path is set. lmdb is deprecated and retained only as an explicit fallback.",
      "oneOf": [
        {
          "const": "fjall",
          "description": "Default fjall backend."
        },
        {
          "const": "lmdb",
          "description": "Deprecated lmdb backend.",
          "deprecated": true
        }
      ],
      "default": "fjall"
    },
    "authorship": {
      "$ref": "./specs/authorship.schema.json"
    }
  },
  "additionalProperties": false
}
```
