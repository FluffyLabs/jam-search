---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/32'
title: 'jam-types.asn: Inconsistent use of  the Gas type'
site: github.com/davxy/jam-test-vectors
created_at: '2025-03-27T13:03:16.000Z'
last_modified: '2025-03-27T13:03:16.000Z'
content_kind: issue
---

# jam-types.asn: Inconsistent use of  the Gas type

## Issue by @sierkov

Some data structures are using U64 type directly instead of using the Gas type.
Is that intentional?

Some examples:
- auth-gas-used (U64) in WorkReport
- accumulate-gas (U64) in WorkResult
- gas-used (U64) in RefineLoad
- gas-used (U64) in CoreActivityRecord
- refinement-gas-used (U64) in ServiceActivityRecord 
- accumulate-gas-used (U64) in ServiceActivityRecord 
- on-transfers-gas-used (U64) in ServiceActivityRecord 



## Comment by @davxy

@sierkov Ty
