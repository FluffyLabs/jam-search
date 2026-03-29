---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/91'
title: Question about handling of `post_state.slot` in statistics test vector
site: github.com/davxy/jam-test-vectors
created_at: '2025-08-17T10:06:14.000Z'
last_modified: '2025-08-17T10:06:14.000Z'
---

# Question about handling of `post_state.slot` in statistics test vector

## Issue by @YuChunTsao

Hello,

I have a question regarding the handling of the `slot` value in both `pre_state` and `post_state`.

According to the `statistics.asn` definition:

```asn
State ::= SEQUENCE {
    -- [π_V] Current validators statistics. Mutated to π_V'.
    vals-curr-stats ValidatorsStatistics,
    -- [π_L] Last validators statistics. Mutated to π_L'.
    vals-last-stats ValidatorsStatistics,
    -- [τ] Prior timeslot.
    slot TimeSlot,
    -- [κ'] Posterior active validators.
    curr-validators ValidatorsData
}
```

The comment for `slot` indicates it represents the "prior timeslot". However, since `Input.slot` determines whether an epoch change occurs, I was wondering if the `post_state` slot should reflect the input slot value, rather than remaining the same as in `pre_state`.

Could you please clarify the intended behavior for the `post_state` slot value? Is it expected to update to match the input slot, or should it remain unchanged?

Thank you very much for your help!



## Comment by @davxy

Slot should remain unchanged in the state.
Statistics is not supposed to be (at least in our vectors proposal) the STF subsystem that changes the slot in the state.
