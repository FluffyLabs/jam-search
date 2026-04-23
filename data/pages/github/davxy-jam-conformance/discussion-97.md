---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/97'
title: OnTransfer statistics in trace 1758621198/00000042.json
site: github.com/davxy/jam-conformance
created_at: '2025-09-23T13:44:47.000Z'
last_modified: '2025-09-23T13:44:47.000Z'
content_kind: discussion
---

# OnTransfer statistics in trace 1758621198/00000042.json

## Discussion by @mateuszsikora

In block 42 there are 2 transfers to service `1706965880`. According to GP:

> Furthermore we build the deferred transfers statistics value X as the number of transfers and the total gas used in transfer processing for each destination service index.

https://graypaper.fluffylabs.dev/#/38c4e62/183304188704?v=0.7.0

In the post state statistics produced by our implementation, service `1706965880` has `2` transfers, but the expected value in the test is `1`. It seems that polkajam might be counting number of invocations and not the transfer count? Am I right or missing something?



## Comment by @davxy

This trace should be retired. Thank you for reporting


## Comment by @davxy

Retired: https://github.com/davxy/jam-conformance/pull/96/commits/314be1bed35bbfc5c5bc7e804496bb92057ac8f8
