---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/57'
title: >-
  Core index encoding is using E2 (little endian) instead of normal integer
  encoding
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-20T18:28:36.000Z'
last_modified: '2025-05-20T18:28:36.000Z'
content_kind: issue
---

# Core index encoding is using E2 (little endian) instead of normal integer encoding

## Issue by @danicuki

When encoding corereports in state trie, this traces are using E2 to encode `core_index`, but the GP defines that it should be encoded using variable size integer encoding (Formula C.24)

https://github.com/davxy/jam-test-vectors/blob/801939484d9b91c89f69e573e3038d52b0406271/traces/reports-l0/00000003.json#L121


## Comment by @davxy

@danicuki core index is now encoded as compact. 
We recently fixed it, can you please retry with the latest revision of https://github.com/davxy/jam-test-vectors/pull/45 ?


## Comment by @danicuki

perfect. It is working now! Thanks
