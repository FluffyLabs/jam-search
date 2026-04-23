---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/828'
title: Run with in-memory database.
site: github.com/FluffyLabs/typeberry
created_at: '2025-12-08T13:40:27.000Z'
last_modified: '2025-12-08T13:40:27.000Z'
content_kind: issue
---

# Run with in-memory database.

## Issue by @tomusdrw

It should be possible to start the node with in-memory database instead of LMDB (see how it's done in fuzzer)

Note this should be possible to specify in the config file and thanks to #727 also possible to override in CLI. 

Dev mode config should run in-memory by default.


## Comment by @tomusdrw

Acceptance criteria:
- [x] Config parameter that can be used instead of a path to specify in-memory database.
- [x] When the config parameter is set, `@typeberry/jam` loads in-memory database instead of LMDB one
- [x] E2E test to make sure the node is running both in database mode and in-memory mode.
- [x] Changing default dev configuration to use in-memory database.
