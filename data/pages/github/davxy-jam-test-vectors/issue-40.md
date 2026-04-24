---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/40'
title: Sample Request for 0.6.5 compliant State Transition data
site: github.com/davxy/jam-test-vectors
created_at: '2025-04-18T13:11:52.000Z'
last_modified: '2025-04-18T13:11:52.000Z'
content_kind: issue
---

# Sample Request for 0.6.5 compliant State Transition data

## Issue by @sourabhniyogi

In preparation for a Lisbon May meetup, we request a 0.6.4 (or later) state transition dataset in the style of 
* [state_snapshots](https://github.com/jam-duna/jamtestnet/blob/main/data/assurances/state_snapshots/1_005.json)
* [state_transitions](https://github.com/jam-duna/jamtestnet/blob/main/data/assurances/state_transitions/1_005.json)

4 (or 5) will have 95% of what we need to prep with confidence:
* the very first state transition with a null_authorizer and a bootstrap service
* the first transition with a guarantee and tickets
* the first transition with an accumulate that does a "new" and maybe a "transfer"
* the first transition with a preimage extrinsic to match the above
* the first transition doing a DOOM-related work report (optional)

If all the above happen within first epoch, then it may be easiest to get the first 13 state transitions so as to see the tickets + epoch marker, entropy shift, etc. 

Is this possible?




## Comment by @davxy

@sourabhniyogi I'll provide some traces next week


## Comment by @davxy

Not done yet .  I got distracted fixing some bugs. I'll deliver it this week! :)))


## Comment by @davxy

@sourabhniyogi I started proposing some vectors https://github.com/davxy/jam-test-vectors/pull/45

I'll try to propose some with work reports very soon


## Comment by @sourabhniyogi

we're rolling now!
