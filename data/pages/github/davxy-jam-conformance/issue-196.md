---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/196'
title: JOTL
site: github.com/davxy/jam-conformance
created_at: '2026-05-05T16:43:05.000Z'
last_modified: '2026-05-05T16:43:05.000Z'
content_kind: issue
---

# JOTL

## Issue by @polykrate

Hello @davxy,

JOTL (JAM On The Lisp) is a Common Lisp JAM implementation targeting GP 0.7.2.

**Repository**: https://github.com/polykrate/JOTL

**Docker image**: `ghcr.io/polykrate/jotl:latest` (also tagged `0.7.2`)

Uses standard target packaging with `JAM_FUZZ*` environment variables:

```bash
docker run --rm \
  -e JAM_FUZZ=1 \
  -e JAM_FUZZ_SPEC=tiny \
  -e JAM_FUZZ_DATA_PATH=/tmp/jam/data/ \
  -e JAM_FUZZ_SOCK_PATH=/tmp/jam/fuzz.sock \
  -e JAM_FUZZ_LOG_LEVEL=info \
  -v /tmp/jam:/tmp/jam \
  ghcr.io/polykrate/jotl:latest
```

**Conformance results**:
- jamtestvectors (8 traces, 1000 blocks): 1000/1000
- minifuzz no_forks: 102/102
- minifuzz forks: 102/102

Multi-session support enabled.

A PR to add JOTL to `scripts/targets.json` will follow.
