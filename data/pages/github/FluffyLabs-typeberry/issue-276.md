---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/276'
title: Move batch blake2b calculation to wasm library
site: github.com/FluffyLabs/typeberry
created_at: '2025-02-28T22:10:47.000Z'
last_modified: '2025-02-28T22:10:47.000Z'
content_kind: issue
---

# Move batch blake2b calculation to wasm library

## Issue by @mateuszsikora

              This seems like a lot of hashing independent values in a loop. I think it's worth adding batch-hashing in `blake2b` and refactor that code in a follow up PR. Could you please create an issue for this?

_Originally posted by @tomusdrw in https://github.com/FluffyLabs/typeberry/pull/261#discussion_r1972415587_
            
