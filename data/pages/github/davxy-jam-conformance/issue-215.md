---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/215'
title: '[Spec] Dedicated protocol spec for fuzzing sessions'
site: github.com/davxy/jam-conformance
created_at: '2026-10-20T07:33:36.000Z'
last_modified: '2026-10-20T07:33:36.000Z'
content_kind: issue
---

# [Spec] Dedicated protocol spec for fuzzing sessions

## Issue by @davxy

- `tiny` has only 6 validators. The validator set cannot change size, and disputes can ban only one offender.
- `full` has the real sizes, but its periods are too long for a fuzz run. An epoch is 600 slots, a new validator set takes up to 1200 slots to come into effect, and a forgotten preimage stays for 19,200 slots. Each step is also several times slower.

The `fuzz` dedicated spec keeps a validator set that can change size and makes the periods short. In 3000 slots a run crosses 50 epoch changes, resizes the validator set many times and ejects services.

### Parameters

`fuzz` is `full` with these changes:

| Parameter | `fuzz` | `full` |
|---|---:|---:|
| C (cores) | 85 | 341 |
| E (epoch length) | 60 | 600 |
| Y (ticket contest length) | 50 | 500 |
| R (core rotation period) | 5 | 10 |
| K (max tickets per block) | 4 | 16 |
| G_T (block accumulate gas) | 875,000,000 | 3,500,000,000 |
| G_R (refine gas) | 1,250,000,000 | 5,000,000,000 |
| D (preimage expunge period) | 900 | 19,200 |
| L (max lookup anchor age) | 600 | 14,400 |

All the other parameters keep their `full` values. The genesis set has 255 validators (3C). 
Designates can resize it to any size in {6, 9, ..., 255}, as GP 0.8.0 `eq:valcount` allows. 

---

### Implementors actions

- Accept `JAM_FUZZ_SPEC=fuzz` in your target image.
- Comment here when your target supports it, or if a value causes a problem.




## Comment by @emielsebastiaan

@davxy PyJAMaz (`latest` or `v0.3.3-gp0.8.0`) has been updated with support for `JAM_FUZZ_SPEC=fuzz`.


## Comment by @jaymansfield

Don't see any issues with the proposed params.

Added them to JavaJAM 0.4.13.


## Comment by @mikirov

I updated pbnjam as well to include this mode


## Comment by @philoniare

Added the mode to JamForge
