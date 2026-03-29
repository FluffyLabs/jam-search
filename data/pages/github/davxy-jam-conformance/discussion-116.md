---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/116'
title: '1763371403'
site: github.com/davxy/jam-conformance
created_at: '2025-11-17T13:04:46.000Z'
last_modified: '2025-11-17T13:04:46.000Z'
---

# 1763371403

## Discussion by @vekexasia

Hello trace 1763371403/00000171 have pre_state 0x4fd17f8b0680007e4c782592f407d51ef667292e81cad51381fdc720ed006169 and post state `0x874d124a24ea58ece41b592db364946041548c725dd76bc2f39a356e0977e166` suggesting the block should apply.

But `EC` & `EF` are empty  and `header.offenders_mark` is not empty conflicting with 0.7.1 / 10.20 making (in my implementation) the block invalid


## Comment by @davxy

your target crashes with this trace


## Comment by @davxy

```
received message IMPORT_BLOCK
node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^

AssertionError [ERR_ASSERTION]: Index out of bounds
    at Gi.at (file:///jam/tsjam-fuzzer-target/cli.mjs:1:151698)
    at Us.blockAuthor (file:///jam/tsjam-fuzzer-target/cli.mjs:1:156864)
    at Us.verifySeal (file:///jam/tsjam-fuzzer-target/cli.mjs:1:156925)
    at Us.checkValidity (file:///jam/tsjam-fuzzer-target/cli.mjs:1:158895)
    at Wi.applyBlock (file:///jam/tsjam-fuzzer-target/cli.mjs:1:241433)
    at Oo.append (file:///jam/tsjam-fuzzer-target/cli.mjs:1:184118)
    at Vr.handleIncomingBlock (file:///jam/tsjam-fuzzer-target/cli.mjs:1:138609)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async s (file:///jam/tsjam-fuzzer-target/cli.mjs:1:253584) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '=='
}
```


## Comment by @vekexasia

I think I fixed the crash. (along with all the other tests in this batch) and it should be up on the new target if you can give it a spin



## Comment by @arjanz

I also believe that the block in `1763371403/00000171.bin` should not be imported, for the same reasons @vekexasia mentions:  Equation 10.20 states that `H_O` should be empty because `E_C` and `E_F` are both empty. 


## Comment by @danicuki

Same here. This block should be pass validation.


## Comment by @davxy

Right! We have a bug in our impl. I'm going to retire this
