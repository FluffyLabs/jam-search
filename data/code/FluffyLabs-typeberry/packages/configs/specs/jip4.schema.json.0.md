---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/specs/jip4.schema.json#L1-L45
title: packages/configs/specs/jip4.schema.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cbf3858a728a38d4ba0904fb8d9fc3fe9d9cbf58db293ab41c3f84a76cde2fba
language: json
---
`packages/configs/specs/jip4.schema.json` (lines 1–45)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Chain Specification",
  "description": "Schema for blockchain chain specification",
  "type": "object",
  "required": ["id", "genesis_header", "genesis_state"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the blockchain network",
      "pattern": "^[a-zA-Z0-9-]+$",
      "examples": ["typeberry-dev"]
    },
    "bootnodes": {
      "type": "array",
      "description": "List of bootstrap nodes for network connectivity",
      "items": {
        "type": "string",
        "description": "Bootnode address in format: peer_id@host:port",
        "pattern": "^[a-z0-9]+@[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+:[0-9]+$"
      },
      "minItems": 1
    },
    "genesis_header": {
      "type": "string",
      "description": "Genesis block header as hex string",
      "pattern": "^[0-9a-fA-F]+$",
      "minLength": 1
    },
    "genesis_state": {
      "type": "object",
      "description": "Initial blockchain state as key-value pairs",
      "patternProperties": {
        "^[0-9a-fA-F]{62}$": {
          "type": "string",
          "description": "State value as hex string",
          "pattern": "^[0-9a-fA-F]*$"
        }
      },
      "additionalProperties": false,
      "minProperties": 1
    }
  },
  "additionalProperties": false
}
```
