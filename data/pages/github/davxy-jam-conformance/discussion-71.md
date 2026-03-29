---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/71'
title: '1757422771, 1757423102, 1757423365'
site: github.com/davxy/jam-conformance
created_at: '2025-09-09T20:47:19.000Z'
last_modified: '2025-09-09T20:47:19.000Z'
---

# 1757422771, 1757423102, 1757423365

## Discussion by @bloppan

In the report 1757422771, the trace `00000032` processes a block produced in the slot 27. The next trace `00000033` processes a block also produced in the slot 27, so this block should be rejected but the fuzzer seems to process it successfully (pre state-root is not equal to post state-root)

Another thing that I noticed is that the post state-root of `00000032` is not equal to the pre state-root of `00000033` and pre state-root of `00000032` is equal to pre state-root of `00000033`.

The same pattern happens with the reports `1757423102` and `1757423365`.

It appears that the fuzzer produces 2 blocks in the same slot but with different extrinsic values.

   


## Comment by @davxy

> In the report 1757422771, the trace 00000032 processes a block produced in the slot 27. The next trace 00000033 processes a block also produced in the slot 27, so this block should be rejected but the fuzzer seems to process it successfully (pre state-root is not equal to post state-root)

Two blocks may be produced and imported for the same slot. This kind of simple forking shuld be supported by the target


## Comment by @davxy

> It appears that the fuzzer produces 2 blocks in the same slot but with different extrinsic values.

Yes, it forks


## Comment by @davxy

Forking is required both in production and in the fuzzer to support mutations.

In production nodes, complex forking is needed, while the M1 fuzzer only requires trivial forking, i.e., forks can occur only at the last successfully imported block. I will include this in the fuzzer protocol spec v1.

Without forking support, blocks mutations are not possible. Which precludes fault injection using interesting techniques


## Comment by @vekexasia

Thnanks for clarifying @davxy i have a question. In perspective of 771 why should block `3` be chosen in favor of block `2`? Which formula of the GP am I missing?


## Comment by @davxy

https://github.com/davxy/jam-conformance/discussions/71#discussioncomment-14360978


## Comment by @bloppan

Thanks for your response, @davxy , I forgot the possibility of forks. I'm going to close this discussion. 


## Comment by @davxy

As far as I recall, there is no strict formula for fork choice. The fork choice rule is essentially an off-chain decision of the block producer.

As a block producer, you decide which fork to extend, following a few guidelines:
- A new block must always build on top of a finalized block, never below it.  
  (This is a hard requirement, though finality itself is not part of the spec yet. Furthermore, when fuzzing, nothing is finalized explicitly).
- One option is to prefer a chain whose ancestry contains fewer blocks produced  
  using the fallback mechanism (i.e. without safrole).
- Another common rule is simply to follow the longest chain.

**In our fuzzer, forks may only be created at the parent of the last successfully imported block. In other words, they can only be siblings of the latest imported block.**

Examples of this rule, if B_i is the block imported on step i:

YES
```
B0--+--B1
       +--B2 -- B3
```

NO
```
B0--+--B1---B2
       +--B3
```

Once the chain has been extended, you never fork more than one block below the head. In other words, forks may only start at the parent of the latest imported block.

The fuzzer typically decides to build over the last imported mutation: 

YES
```
B0--+--B1
       +--B2 -- B3
```

NO
```
B0--+--B1 -- B3
       +--B2
```

I'll add all this stuff in the README of fuzzer protocol v1 https://github.com/davxy/jam-conformance/pull/47
