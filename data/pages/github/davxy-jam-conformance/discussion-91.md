---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/91'
title: '1757406516, 1757862468, 1757862472'
site: github.com/davxy/jam-conformance
created_at: '2025-09-17T08:25:53.000Z'
last_modified: '2025-09-17T08:25:53.000Z'
---

# 1757406516, 1757862468, 1757862472

## Discussion by @0xjunha

It seems these traces have some PVM invocations with `Panic` or `PageFault` exit reasons for `Ψ1` due to invalid memory read/write.
According to `accumulate_gas_used` field in statistics state of the traces, it seems those cases charge gas for the failing instructions (which attempted invalid memory accesses), whereas GP states they should not mutate VM state at all, immediately exiting with `Panic` or `PageFault`.

GP reference: https://graypaper.fluffylabs.dev/#/38c4e62/251901251901?v=0.7.0

If this was ambiguous in v0.7.0, it is clarified in v0.7.2:
https://graypaper.fluffylabs.dev/#/ab2cdbd/256c01256c01?v=0.7.2


## Comment by @clearloop

If I recall correctly, the basic PVM tests have a lot of this case as well


## Comment by @davxy

which one?


## Comment by @clearloop

most of the `*_nok` tests are broken at memory operation and charges the gas


## Comment by @davxy

Sorry but I don't understand. What/where are the *_nok cases? Can you point me to one of these tests? Are in the jam-test-vectors repo?


## Comment by @0xjunha

I guess @clearloop referred to https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/TESTCASES.md


## Comment by @davxy

@0xjunha  indeed according to A.8 the gas is left untouched.
However, I think that makes more sense to charge for the instruction that triggered the fault.

Begin of section A.1

> Assuming the program blob is valid (which can be validated statically), some gas is always charged whenever execution
> is attempted. This is the case even if no instruction is effectively executed and machine state is unchanged (i.e. the result
> state is equal to the parameter).

Otherwise no gas is charged if the very first instruction is one that triggers a trap for memory access.



## Comment by @0xjunha

> @0xjunha indeed according to A.8 the gas is left untouched. However, I think that makes more sense to charge for the instruction that triggered the fault.
> 
> Begin of section A.1
> 
> > Assuming the program blob is valid (which can be validated statically), some gas is always charged whenever execution
> > is attempted. This is the case even if no instruction is effectively executed and machine state is unchanged (i.e. the result
> > state is equal to the parameter).
> 
> Otherwise no gas is charged if the very first instruction is one that triggers a trap for memory access.

Makes sense. Thank you for the input and the PR!


## Comment by @davxy

https://github.com/gavofyork/graypaper/pull/497
