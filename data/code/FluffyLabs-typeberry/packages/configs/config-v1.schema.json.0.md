---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/config-v1.schema.json#L1-L45
title: packages/configs/config-v1.schema.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 570696d5ea84e348a8093a21000a94dd901fbfbf3c9596b74eae5d4812b42e46
language: json
---
`packages/configs/config-v1.schema.json` (lines 1–45)

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
    },
    "rpc": {
      "type": "object",
      "description": "RPC server configuration. When present, an in-process JSON-RPC WebSocket server is started.",
      "required": ["port"],
      "properties": {
        "port": {
          "type": "number",
          "description": "Port for the JSON-RPC WebSocket server.",
          "default": 19800
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```
