---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/42'
title: Test vectors for state keys
site: github.com/davxy/jam-test-vectors
created_at: '2025-04-26T14:34:20.000Z'
last_modified: '2025-04-26T14:34:20.000Z'
---

# Test vectors for state keys

## Issue by @clearloop



> The overall process is relatively straightforward. Once the tool communicates the genesis state to the target, it will begin submitting procedurally generated blocks, which your implementation should attempt to import. It will then validate the resulting state root against the expected one. 
>
> On failure, a test vector is produced (prior raw state kv + block + posterior diff with expected state).
>
> [matrix link](https://paritytech.github.io/matrix-archiver/archive/_21wBOJlzaOULZOALhaRh_3Apolkadot.io/index.html)

as said in matrix, fuzzer results in state kv diff in errors, in this case, there could be a tough situation that the implementors' key constructions are incorrect initially:

since debugging state keys is the first step of any fuzzer errors, I'd propose that we can introduce test vectors for state key constructions as well which will save a lot of time on debugging the fuzzer errors


## Comment by @davxy

> as said in matrix, fuzzer results in state kv diff in errors, in this case, there could be a tough situation that the implementors' key constructions are incorrect initially:

The prior state is always assumed to be valid.

As I said the tool can work in two ways:
1) Sequential blocks importing.
2) Pure fuzzer

As sequential blocks producer: each block is related to the previous one (constructs a proper chain) 
- For the first STF step: Genesis state is valid (it is given)
- Before executing step N+1, previous state N should be valid and match the expectations (otherwise we should not attempt to execute step N+1). 

As a pure fuzzer: each block is not related to the previous. In this case:
1. we start from a given state
2. we give a block, you import it and return the state root 
3. you reset the state as it was before execution. Goto 2


> I'd propose that we can introduce test vectors for state key constructions as well which will save a lot of time on debugging the fuzzer errors

I don't think I fully understood your proposal


## Comment by @clearloop

sorry for the confusing, basically, I'm concerned about [D.2](https://graypaper.fluffylabs.dev/#/cc517d7/391100391100?v=0.6.5), for example with sequential blocks producer, I got an error:

```json
{
  "block": 3,
  "pre_state": { /* ... */ }, 
  "extrinsic": { /* ... */ } ,
  {
    "post_state": {
       // ...
       "0xabcd": "0x42"
   }
 }
}
```

while the post state in the implementors node is:

```json
{
   "post_state": {
      // ... 
      //
      // 1. the key may be 0xabcd but not 0xabce
      // 2. the diff of the value could be caused by incorrect encoding
      "0xabce": "0x4242"
    }
}
```

after rechecking the state keys more carefully, looks they are clear enough for us to translate / check in mind, for the value part, it could be covered by https://github.com/davxy/jam-test-vectors/issues/40,  since `keyvals` are proposed in `state_transitions`

I'm closing this issue now! Thanks for your time!


## Comment by @davxy

Which blocks are you trying to import? Jamduna?
By the way, we'll soon propose some test vectors using the same format as Duna.
Actually, according to #40 , we should have already done it - I'm a bit late! 😅


## Comment by @clearloop

> Which blocks are you trying to import? Jamduna? By the way, we'll soon propose some test vectors using the same format as Duna. Actually, according to [#40](https://github.com/davxy/jam-test-vectors/issues/40) , we should have already done it - I'm a bit late! 😅

just iterating the problems we may meet in mind now... haven't tried importing blocks from other implementations yet since we don't want to introduce additional data structures and spend time debugging them atm... ( if we don't have to  )

> we'll soon propose some test vectors using the same format as Duna

good to know! if so, will wait for #40, or mb try duna if we have enough time!
