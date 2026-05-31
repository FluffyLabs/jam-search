---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/config-v1.schema.json#L1-L32
title: packages/configs/config-v1.schema.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e6fb9ea2379f2f8f1bccc134f10d5a2719420bcd8cda47aacfaaaf3c25cef6a1
language: json
---
`packages/configs/config-v1.schema.json` (lines 1–32)

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
    "authorship": {
      "$ref": "./specs/authorship.schema.json"
    }
  },
  "additionalProperties": false
}
```
