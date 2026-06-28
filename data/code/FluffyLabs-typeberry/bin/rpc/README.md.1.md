---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/README.md#L188-L211'
title: bin/rpc/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: e01f3066e4095c29fd5a9aaca28f9b02e0431320a9d1fe79f79595e677699016
language: markdown
---
`bin/rpc/README.md` (lines 188–211)

```markdown
- **Default Host**: 0.0.0.0 (listens on all interfaces)
- **Database Access**: Read-only LMDB connection

## Error Handling

The server returns standard JSON-RPC 2.0 error responses:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found"
  }
}
```

Common error codes:
- `-32700` - Parse error
- `-32600` - Invalid request
- `-32601` - Method not found
- `-32602` - Invalid params
- `-32603` - Internal error
```
