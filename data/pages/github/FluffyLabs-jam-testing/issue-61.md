---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/61'
title: 'Demo fuzz failure: graymatter → jampy (full)'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-05-08T21:57:47.000Z'
last_modified: '2026-05-08T21:57:47.000Z'
content_kind: issue
---

# Demo fuzz failure: graymatter → jampy (full)

## Issue by @github-actions[bot]

cc @dakk

The demo graymatter fuzz source test against **jampy** with spec **full** failed.

**Run:** https://github.com/FluffyLabs/jam-testing/actions/runs/25575466261

Please investigate and close this issue once resolved.


## Comment by @dakk

Are you sure that the graymatter fuzzer is using correct full spec constants? It is sending 2 work_reports instead of 341 (equation 11.1)


## Comment by @tomusdrw

I didn't look very carefully, but I guess it should be "at most 341" work reports and not "exactly 341"? So 2 would still be fine.

https://search.fluffylabs.dev/#/ask/s/e84e99d3-e56c-4f71-80dd-0d9855649c0c


## Comment by @dakk

I think it says exactly C elements (an element can also be null). It is a direct mapping between core index -> report | null


## Comment by @tomusdrw

Ah, I just checked the equation and you mean the state component `rho`, right? https://graypaper.fluffylabs.dev/#/ab2cdbd/13a40113a401?v=0.7.2

I guess it's worth intercepting the state that fuzzer pushes, I was under the impression that our implementation (typeberry) would definitely fail if the encoding was mismatched in the state (and that does not happen). So perhaps there is something off here.

When I have a bit more time I'll try to run typeberry with the exact same seed as you got here, perhaps that's something very specific to the seed.


## Comment by @dakk

yes, equation 11.1; ok let me know. Btw I'm running it locally and I'm having the same issue with every seed I tried


## Comment by @tomusdrw

CC @ggwpez
