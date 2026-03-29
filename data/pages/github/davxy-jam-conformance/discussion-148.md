---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/148'
title: '1767827127_3321'
site: github.com/davxy/jam-conformance
created_at: '2026-01-08T12:15:08.000Z'
last_modified: '2026-01-08T12:15:08.000Z'
---

# 1767827127_3321

## Discussion by @davxy

Part of [NYB](https://github.com/davxy/jam-conformance/pull/147)

The parallel accumulation takes as input $\textbf{e} \in \mathbb{S}$, which includes **d**, a snapshot of the service accounts dictionary taken before parallel accumulation starts.

During the first parallel accumulation ($\Delta_*$):

- *Some* service transfers funds to Service 2762843414 (0xa4ada516). The funds are withdrawn as expected.
   - The transfer accumulation for 2762843414 is scheduled to run on the next parallel accumulation.

During a subsequent parallel accumulation:
These two services are accumulated in parallel:

1. Service 0 ejects Service 2762843414.
2. Service 2762843414 processes the incoming transfer
   - Code for 2762843414 not executable (as it was already a zombie before second parallel accumulation starts),
     but funds are credited to its account (as per GP B.9).
   - From Service 2762843414's storage perspective, its account still exists.
   - The account state of 2762843414 is updated with the new balance.

As a consequence, when overall changes are integrated at the end of accumulation, Service 2762843414's account is first removed when integrating Service 0's changes, but then restored when integrating Service 2762843414's changes.
The restored account content is also not incorrect (for example, it has a preimages count of 2, even though its preimages were already reaped at this point by service 2762843414 eject).

I would appreciate your interpretation of GP on this matter.

I see that most of implementations are not executing step 2 (i.e. service 2762843414 incoming transfer), thus they not end up restoring its account (as we do).




## Comment by @davxy

I included `1767827127_3321_2` in the NYB (which isolate the disputed step)


## Comment by @vekexasia

Hello @davxy I agree with the steps you described here 

> * Service 0 ejects Service 2762843414.
> * Service 2762843414 processes the incoming transfer
>   
>   * Code for 2762843414 not executable (as it was already a zombie before second parallel accumulation starts),
>     but funds are credited to its account (as per GP B.9).
>   * From Service 2762843414's storage perspective, its account still exists.
>   * The account state of 2762843414 is updated with the new balance.

But in my opinion `2762843414` should not be restored. I think all boils down on what **m** in 12.19 is.

Given that:
- $(∆(0)_{e})_d$ do **not** contain `2762843414`
- $(∆(2762843414)_{e})_d$ do contain `2762843414`
- other accumulated services "posterior"-delta do contain `2762843414`

Then:
**m** should also contain `2762843414` because of the union operator.

I implemented the **m** calculation in tsjam rougly equivalent to this:

```
let m:= {}
for each s in bold_s
  for each d in delta
      if s.postState.delta  not contain d
         m += s
```

Note: this should have the effect of losing "track" of the transfered funds.





## Comment by @davxy

@vekexasia makes sense. Thank you


## Comment by @danicuki

we at @jamixir also don't restore the account


## Comment by @boymaas

JamZig⚡ interprets as follows: δ' = (δ ∪ n) \ m — the \ m at the end means deletions must always win over modifications. This ensures deletions win regardless of commit order, and the transfer amount is effectively burned (not credited to anyone). 
