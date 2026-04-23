---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/528'
title: Fuzz-target IPC endpoint
site: github.com/FluffyLabs/typeberry
created_at: '2025-08-04T13:16:22.000Z'
last_modified: '2025-08-04T13:16:22.000Z'
content_kind: issue
---

# Fuzz-target IPC endpoint

## Issue by @tomusdrw

There is fuzzing tool available from PolkaJAM to test the behaviour of different implementations. I suspect that this will be the format required for M1 submissions.

This issue is about implementing support for being fuzz target, meaning:
- [ ] Implementing IPC endpoint speaking JAM-codec. (I think we actually already have one :))
- [ ] Implementing all required messages
- [ ] Actually rendering the right behaviour when messages are received.
