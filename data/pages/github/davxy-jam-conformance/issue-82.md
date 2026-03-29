---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/82'
title: Potential bug on v1 proto examples transition from 29 to 30
site: github.com/davxy/jam-conformance
created_at: '2025-09-15T08:43:16.000Z'
last_modified: '2025-09-15T08:43:16.000Z'
---

# Potential bug on v1 proto examples transition from 29 to 30

## Issue by @danicuki

Maybe there is an error with transition from 29 to 30:
Block 29 header hash is `0x91fcda538898b174da9b61af42c141fb0e1549e4e0dfc1ca8caec4c6185eeea5`
but on [Block History state](https://github.com/davxy/jam-conformance/blob/d2ad97d21774be507aaccbd9ff14e66f92478b74/fuzz-proto/examples/v1/00000030_target_state.json#L65), it has `0xb13b648e9030118a6bf912aaca95a78b66c86cbd41d112b21393d4b896eaf864`

Could you explain where this `0xb13b648e9030118a6bf912aaca95a78b66c86cbd41d112b21393d4b896eaf864` comes from?



## Comment by @davxy

We simulate a buggy target.  

At step 29, the target sends an unexpected `StateRoot` value.  
In response, the fuzzer issues a `GetState` request.  
The target then returns its state -- which is expected not to match the correcly computed state.  

In fact -- as per fuzzer protocol -- the fuzzer sends a `GetState` message only when the target reports an unexpected root, as this usually indicates a state inconsistency.


## Comment by @danicuki

Ah. Ok. Got it. I thought the target binaries responses were supposed to be correct in the examples. Maybe that should be explained somewhere. Thanks
