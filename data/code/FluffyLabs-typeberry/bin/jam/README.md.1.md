---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/README.md#L148-L217'
title: bin/jam/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 877eeda009a7a14b73cd135f4990b87fb296343874aeaef6d9f031e35ae48fd7
language: markdown
---
`bin/jam/README.md` (lines 148–217)

```markdown
| `JAM_FUZZ_DATA_PATH` | No | Database location. A real path runs the target against an on-disk LMDB database (recommended for full-spec runs, to bound memory). Unset, empty, or `undefined` keeps the in-memory database (the default). |
| `JAM_FUZZ_LOG_LEVEL` | No | Log verbosity: `error`, `warn`, `info`, `debug`, `trace`. Overrides `JAM_LOG` in fuzz mode. |

The target stays up across multiple fuzzer sessions; on each `Initialize`
message it resets the state to the genesis sent by the fuzzer. By default the
state is held in memory. If `JAM_FUZZ_DATA_PATH` points at a real directory, the
target uses an on-disk LMDB database instead (wiped on every reset, so each
session starts clean); if that database cannot be opened it logs a warning and
falls back to in-memory. On the on-disk backend pruning is disabled, so every
block's state is retained for the whole session (this grows disk, not memory),
which lets the fuzzer query the state of any past block. The in-memory backend
keeps pruning enabled to bound memory.

**Docker example:**

```bash
docker run --rm \
  -e JAM_FUZZ=1 \
  -e JAM_FUZZ_SPEC=tiny \
  -e JAM_FUZZ_SOCK_PATH=/tmp/jam.sock \
  -e JAM_FUZZ_DATA_PATH=/tmp/jam-data \
  -v /tmp:/tmp \
  typeberry:latest
```

### OpenTelemetry Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OTEL_ENABLED` | Enable/disable OpenTelemetry | `true` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL to push metrics to | `http://localhost:9090/api/v1/otlp` |

**Example:**

```bash
# Metrics will be pushed to local prometheus with OTLP receiver.
jam dev 1

# Disable telemetry
OTEL_ENABLED=false jam dev 1
```

### Local Prometheus via Docker

To inspect metrics pushed over OTLP, start a Prometheus container with the OTLP receiver enabled:

```bash
docker run -d -p 9090:9090 --name=prometheus prom/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --web.enable-otlp-receiver
```

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
