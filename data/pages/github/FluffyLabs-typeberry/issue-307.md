---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/307'
title: JSON-RPC stub
site: github.com/FluffyLabs/typeberry
created_at: '2025-03-31T13:26:48.000Z'
last_modified: '2025-03-31T13:26:48.000Z'
content_kind: issue
---

# JSON-RPC stub

## Issue by @tomusdrw

JAM node should expose standard RPC methods for the extra tooling to work.

https://hackmd.io/@polkadot/jip2


## Comment by @tomusdrw

Similarly to how `IPC` server is started start new RPC server.

I think ideally it should just open the database in a readonly mode and be completely separate from the main client for now.
