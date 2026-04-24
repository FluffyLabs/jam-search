---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/382'
title: JSON RPC subscribe/submit methods
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-15T10:50:17.000Z'
last_modified: '2025-05-15T10:50:17.000Z'
content_kind: issue
---

# JSON RPC subscribe/submit methods

## Issue by @skoszuta

Currently the RPC works with the DB in read-only mode and isn't connected to the chain. That makes implementing subscribe and submit methods (https://hackmd.io/@polkadot/jip2) unfeasible.
