---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/106'
title: fuzzy/00000037.json
site: github.com/davxy/jam-test-vectors
created_at: '2025-11-04T11:35:36.000Z'
last_modified: '2025-11-04T11:35:36.000Z'
content_kind: issue
---

# fuzzy/00000037.json

## Issue by @tomusdrw

We have some issue with passing `fuzzy/00000037.json`:
1. Difference in gas used by service 1809622564 (aka 0x6bdca624)
2. And different storage value at `0x05` for that service.

While investigating this traces we've noticed a bug in version 0.7.1 of the GP:
https://graypaper.fluffylabs.dev/#/1c979cb/373d01373d01?v=0.7.1

namely, it seems that instead of checking if `b` (new balance) is above the threshold we check `a` (transfer amount).
This bug seems to be fixed in 0.7.2 though.

Is 0.7.1 expected to replicate this buggy behavior? And more importantly is this behavior required to pass that test vector? If yes, then it's not clear what to do with negative balance that the sending service will get?

```
TRACE [host-calls] TRANSFER(1809622606, 3039633858, 0, 0x6769667400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000) <- Balance -3039269942 below threshold 158858
```

It seems that other teams were able to pass this vector, perhaps someone would be willing to share a trace?


## Comment by @davxy

@tomusdrw Is this fixed?


## Comment by @tomusdrw

Yes. The reason for failing the trace was unrelated, and the Gray Paper bug implementation was not required. Since we are moving to 0.7.2 anyway, this can safely be closed. Thanks!
