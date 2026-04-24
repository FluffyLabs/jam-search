---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/README.md#L162-L179'
title: bin/jam/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: f66fccbb4b133812f1b66880c056162b74780f1f1f36b467c9e520b5c08c1854
language: markdown
---
`bin/jam/README.md` (lines 162–179)

```markdown
The default `OTEL_EXPORTER_OTLP_ENDPOINT` already points to the local instance, so run the node and open `http://localhost:9090` to explore the collected telemetry.

## Development

The `dev` command is designed for local testing with multiple validators:

```bash
# Terminal 1
jam dev 1

# Terminal 2
jam dev 2

# Terminal 3
jam dev 3
```

Each validator automatically discovers the others via local bootnodes and begins block production.
```
