---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/README.md#L151-L210'
title: bin/jam/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 2538d7fe3e020689ae4561daed420c4369f81808acb5fb2dba393dc415a8fe7f
language: markdown
---
`bin/jam/README.md` (lines 151–210)

```markdown
The target stays up across multiple fuzzer sessions; on each `Initialize`
message it resets the in-memory state to the genesis sent by the fuzzer.

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
