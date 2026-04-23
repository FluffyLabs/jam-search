---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/79'
title: Clarification on genesis state
site: github.com/davxy/jam-test-vectors
created_at: '2025-06-16T14:05:46.000Z'
last_modified: '2025-06-16T14:05:46.000Z'
content_kind: issue
---

# Clarification on genesis state

## Issue by @vekexasia

Hello,

by looking at your [your traces](
https://github.com/davxy/jam-test-vectors/blob/a67d7d82ed7b486a77a99a3099d7a00e72a84922/traces/fallback/00000000.json)

it looks like that when you apply genesis you start from empty state but it seems like you have some other constants as well that are fed into your state transitioning functions when calculating the posterior state of your genesis.

For example it looks like the validators have some metadata and you also have some input entropy given that your posterior eta values are

```
581348337b0f3e148620173daaa5f94d00d881705dcbf0aa83efdaba61d2ede1
94679731f37a1e0214e4416c51fe063a9c68bac0c0aa7b79b808fc51bfd35278
ed18da40256f563eb2b217b8776cc917924bb60f51fe10daf731ef400f680086
d2a5fe2a54e2a0aeaabb57e53ab17f63342f44e05c03500dd66ffc04c69bd258
```

I read https://github.com/polkadot-fellows/JIPs/pull/2 and but couldn't find anything related to these initial states. 


## Comment by @davxy

Please have a look at v0.6.6 PR
