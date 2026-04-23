---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/98'
title: Privileged services in trace 1758622403/00000239.json
site: github.com/davxy/jam-conformance
created_at: '2025-09-23T15:03:36.000Z'
last_modified: '2025-09-23T15:03:36.000Z'
content_kind: discussion
---

# Privileged services in trace 1758622403/00000239.json

## Discussion by @mateuszsikora

The trace `1758622403/00000239.json` expects **not** to update `designate` service but it looks all conditions are met and `BLESS` host call is executed correctly. Am I right or missing something?

From our traces:
```
TRACE [host-calls] SERVICE [0] [3] boot Decoded instruction: Bless { manager: 0, assign: 0, designate: 1590169877, auto_acc: [] }
...
TRACE [host-calls] BLESS(0, 0,0, 1590169877, ) <- OK
```

The entire state object is the same, except for the privileged services `0x0c000...000`
 


## Comment by @jaymansfield

Noticing the same thing.

1758622403 and 1758622442 both have that issue.

The updated designate service ID is not persisted in the expected post state for them.


## Comment by @davxy

In the parallelizable $\Delta_*$:  
- First, we accumulate the manger-service (0) using $\Delta_1$.  
- This yields a new designator $v^*$.  
- $v'$ is then assigned according to the single-service accumulation $\Delta_1$  of $v^*$.  
    - This sets *unconditionally* $v'$ to $\Delta_1 (v^*)ₑ)ᵥ$   (fixed GP flaw).  
    - The effect of this operation is a rollback of the change.  

As **Gav** once noted, this was a flaw in the **GP**, which has been fixed in **GP ≥ 0.7.1**.



## Comment by @jaymansfield

Thanks for the explanation. 

Clearly not the outcome one would expect or desire.. just the result of a bad GP formula.

Almost seems like one of the times we should deviate from the spec to correct? What do you think?


## Comment by @davxy

I agree that "as is" is useless, but we decided to include the fix in the **Polkajam 0.7.1** release (which also means in fuzzer 0.7.1).  
I'll likely start working on 0.7.1 as soon as the last batch of traces has been *digested*.



## Comment by @jaymansfield

Sounds good. Will wait for 0.7.1. Thanks.


## Comment by @jaymansfield

Hey @davxy,

I've compared my logic again for this to the GP and now see a discrepancy. 

Are you able to take a look at 1758622000? 

In this case the manager service is accumulated which yields new designator 3574500572. But this time it is not reverted and the post state still expects 3574500572. The difference with this test case and the one above is that service 3574500572 is not accumulated here. 

But with my understanding of the GP logic here I don't see how the **v*** value remains as it's not the one returned from **∆∗** (it returns **v'**) which should still be equal to **v** here (service 0).




## Comment by @vekexasia

Not sure but same "behavior" seems to happens to me also in 1758622051, 1758622160 and 1758622524.  What i am observing is this in 1758622051:

services `237018539` and `0` are accumulated. Manager ( s=0 ) yields new designator `2583261619` which as per 0.7.0 should be "accumulated" to compute `v'` . The problem here is that in `12.21` seems to assign `g=0` for this service as it is unknown to that $\mathbf{f}$ dictionary. hence it "does not really get accumulated"
