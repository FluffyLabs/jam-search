---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/18'
title: >-
  Verifying Shuffle and Rotate => assigning validators to cores in Reports =>
  WRONG_ASSIGNMENT check.
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-12T10:42:41.000Z'
last_modified: '2025-02-12T10:42:41.000Z'
---

# Verifying Shuffle and Rotate => assigning validators to cores in Reports => WRONG_ASSIGNMENT check.

## Issue by @decentration

Could I clarify how you got to having [`1,4,5 and 0,2,3`](https://github.com/davxy/jam-test-vectors/blob/polkajam-vectors/reports/tiny/reports_with_dependencies-1.json) as validators connected to `core_index[0]` and `core_index[1]` respectively.  (GP formulas [(11.19 to 11.22)](https://graypaper.fluffylabs.dev/#/579bd12/14b90114b901)). 

in `/reports` its mostly the same example input.slot = 14 and e.g. input.guarantees[0].slot = 14. 

using the example => [reports/many_dependencies-1.json](https://github.com/davxy/jam-test-vectors/blob/529f0edfcaf266e5df699970b7d27a9465c1ee75/reports/tiny/many_dependencies-1.json#L62). 

the consts for tiny are:

```
ROTATION_PERIOD = 4, EPOCH_LENGTH = 12, CORES = 2, VALIDATORS = 6
```

my working out for the above example is:

-  epochPhase = slot 14 % 12 = 2. 
-  count = epochPhase / ROTATION_PERIOD = floor(2/4) = 0
-  offset =  count * (VALIDATORS / CORES) = 0 * 3 = 0 

so in slot 14 there is **no rotation**. 

here core_index[0] has validators (ordered 1, 4 and 5) and core_index[1] has (ordered 0, 2 and 3). so i want to produce a permutation that has the above 2 sets (perhaps in unordered number of ways). 

but my base permutation (using entropy[2] `b"7b0aa1735e5ba58d3236316c671fe4f00ed366ee72417c9ed02a53a8019e85b8`) has produced a permutation of `[ 5, 0, 4, 3, 2, 1 ]`. This is bad because there is no way that this can be rotated to produce ~`[1,4,5, 0,2,3]`, so am I producing the permutation incorrectly and/or with some incorrect assumptions? 

so i looked at the previous epoch permutation  using `(η′3, λ′)` and it produced [ 3, 2, 1, 4, 5, 0 ], this is in some kind of order to potentially be 1,4,5, 0,3,2 but with with needing a rotation of 2 to the left, which is not feasible with 3 validator chunks. But anyway, i dont see how a report produced in slot 14 while being in slot 14 can have the validators assignment from a previous set?

So perhaps my shuffling is wrong? But...

having passed the Fisher-Yates Shuffle [shuffle/shuffle-tests.json](https://github.com/w3f/jamtestvectors/blob/master/shuffle/shuffle_tests.json) test vectors, i am pretty sure about the ability to shuffle and produce the expected permutations with the entropy seed. But you didn't do shuffle in that repo so there is a chance you have done this differently?

can you confirm with me what base permutation you have for this? and does it pass the shuffle test in w3f/jamtestvectors/shuffle? or can you see an ovcious error in my understanding? 

cheers : )





## Comment by @ggwpez

>So perhaps my shuffling is wrong?

You could compare it with our RPC, it has normal shuffle, seeded shuffle and sequence from seed: https://dev.jamcha.in/#/Functions/Gm.OpenApiWeb.FunctionsController.fisher_yates_seeded  
It is unofficial though, provided by the JamBrains team.


## Comment by @decentration


@ggwpez, yes my shuffle is same with your rpc, but this shuffle does not seem to be able to verify assignments in [reports/...](https://github.com/davxy/jam-test-vectors/blob/529f0edfcaf266e5df699970b7d27a9465c1ee75/reports/tiny/many_dependencies-1.json#L62)


## Comment by @decentration

I understand now to shuffle core indices instead of validators indices and i am able to pass the conformance tests. 
