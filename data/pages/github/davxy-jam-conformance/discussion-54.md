---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/54'
title: '1756548459'
site: github.com/davxy/jam-conformance
created_at: '2025-09-02T15:38:01.000Z'
last_modified: '2025-09-02T15:38:01.000Z'
content_kind: discussion
---

# 1756548459

## Discussion by @boymaas

Hi @davxy,

I believe I found the issue with trace 1756548459. The fuzzy service attempts an `bless` host call with V=2^32 (0x100000000).

According to my understanding of the graypaper (Appendix B, equation B.37), service IDs must be in ℕ₃₂, which means they should fall within the range [0, 2^32-1]. Since V=2^32 is just outside this range, I think JamZig should return a WHO error here. This could explain the discrepancy in counter values (-4 vs -9).

Could you verify if I'm interpreting the specification correctly? If so, this may indicate that PolkaJam bless hostcall accepts a value it shouldn't. See: https://graypaper.fluffylabs.dev/#/38c4e62/362301363701?v=0.7.0



## Comment by @davxy

The designated ID is indeed `2^32` (thus is not valid).

However, before that check, the `HUH` condition is evaluated, and the current service does not have permission to call `bless`.

At the time of the call:
- **Manager service:** `0`
- **Current service:** `2387142948`



## Comment by @boymaas

Check; it seems we are following the exact order of the conditions defined in the gray paper. I made changes, and now it works perfectly.
