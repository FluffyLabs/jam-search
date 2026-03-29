---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/55'
title: '1756572122'
site: github.com/davxy/jam-conformance
created_at: '2025-09-02T15:54:36.000Z'
last_modified: '2025-09-02T15:54:36.000Z'
---

# 1756572122

## Discussion by @boymaas

I have a small gas delta of exactly 5 gas. I see that many teams seem to agree on the execution. I'm curious about where the delta is. Could someone provide an execution trace so I can identify where we diverge?


## Comment by @qiweiii

I also had this, it's caused by our check on gas before running the last hostcall, so it exits with oog before consuming gas, and seems GP does not say this... so I guess other teams are correct


## Comment by @boymaas

Yes, it was a very small detail and easy to fix. In fact, the gray paper mentioned this explicitly. I believe so as well.
