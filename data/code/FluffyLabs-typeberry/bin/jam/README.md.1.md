---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/README.md#L148-L218'
title: bin/jam/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: ac03e8aea9f31e62561458b9d7267a1ed2f92cb4180ac09ec516ec9f5ec69714
language: markdown
---
`bin/jam/README.md` (lines 148–218)

```markdown
| `JAM_FUZZ_DATA_PATH` | No | Database location. A real path runs the target against the hybrid backend (in-memory leaves plus an on-disk LMDB value store, recommended for full-spec runs to bound memory). Unset, empty, or `undefined` keeps the fully in-memory database (the default). |
| `JAM_FUZZ_LOG_LEVEL` | No | Log verbosity: `error`, `warn`, `info`, `debug`, `trace`. Overrides `JAM_LOG` in fuzz mode. |

The target stays up across multiple fuzzer sessions; on each `Initialize`
message it resets the state to the genesis sent by the fuzzer. By default the
state is held entirely in memory. If `JAM_FUZZ_DATA_PATH` points at a real
directory, the target uses a hybrid backend instead (wiped on every reset, so
each session starts clean); if that store cannot be opened it logs a warning and
falls back to in-memory. The hybrid backend keeps the trie-leaf sets in memory
(so it still prunes at finality depth 10_000 to bound memory, like the in-memory
backend) but persists the large values to an on-disk LMDB store fronted by an
in-memory LRU cache. This keeps memory bounded while the large values live on
disk. 

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
| `OTEL_ENABLED` | Enable/disable OpenTelemetry (set to `true` to enable) | `false` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL to push metrics to | `http://localhost:9090/api/v1/otlp` |

**Example:**

```bash
# Telemetry is off by default.
jam dev 1

# Enable telemetry: metrics will be pushed to local prometheus with OTLP receiver.
OTEL_ENABLED=true jam dev 1
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
