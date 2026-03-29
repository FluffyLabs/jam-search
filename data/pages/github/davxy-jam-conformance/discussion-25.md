---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/25'
title: '`1755530300/00000005` invalidates all of the other traces'
site: github.com/davxy/jam-conformance
created_at: '2025-08-20T07:09:21.000Z'
last_modified: '2025-08-20T07:09:21.000Z'
---

# `1755530300/00000005` invalidates all of the other traces

## Discussion by @clearloop

this [trace][trace] has integrated the accumulate root in traces while all of others including the test vectors of `0.6.7` are using `[0; 32]`, we can pass this if we integrate the root but it will break all of other tests

[trace]: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/traces/1755530300


## Comment by @jaymansfield

I didn't have any issues with this one. Which GP equation are you referring too?


## Comment by @clearloop

It's the case in https://github.com/gavofyork/graypaper/pull/405, the MMB part, in GP it's at (7.7), I can pass this trace via applying MMB to the MMR, however once doing so, it will break all other tests XD, because others simply passing empty accumulation root, I'll give it another try if you can pass it with empty accumulate root 

also, as I know, in the test vectors of `0.6.7`, the accumulate test vectors integrated this but the traces not


## Comment by @clearloop

Oh I got it, it seems caused by we mapped the empty output to [0; 32], trying to fix it again now


## Comment by @clearloop

thank you so much for poking me @jaymansfield, just resolved!


## Comment by @jaymansfield

The others are using am empty hash for the accumulation root because their were no outputs from their service accumulations (θ′ is empty). The Mb() of am empty array is your [0; 32]. 

This test has an output that would be included in θ′ which is why it generates a different root.

I'd double check these:

<img width="300" height="51" alt="Screenshot 2025-08-20 at 9 12 52 AM" src="https://github.com/user-attachments/assets/c97dc783-6862-466e-8751-79ccdf6e811b" />

<img width="453" height="80" alt="Screenshot 2025-08-20 at 9 26 47 AM" src="https://github.com/user-attachments/assets/c3f2bd93-c1c2-4446-b895-e03189525c11" />

<img width="317" height="29" alt="Screenshot 2025-08-20 at 9 39 43 AM" src="https://github.com/user-attachments/assets/06b90920-867a-4aa7-aa8e-d4718d7995a6" />

