---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/9'
title: Jamixir
site: github.com/davxy/jam-conformance
created_at: '2025-08-05T14:17:11.000Z'
last_modified: '2025-08-05T14:17:11.000Z'
---

# Jamixir

## Issue by @danicuki

Binaries at https://github.com/jamixir/jamixir-releases

We are trying to make @jamixir compliant with the fuzzer, @davxy asked:

> Hi Daniel. The application starts now.
> 
> It looks like your reply to the PeerInfo message is incorrect. This is the raw byte buffer I received:
> 0x004a616d69786972000607000607
> Specifically, the length prefix before the PeerInfo "name"field is missing. The **corrected** buffer should be:0x00074a616d69786972000607000607`
> If I manually fix the message and proceed to send the SetState message, your application does not respond and terminates with the following error:

```
10:26:43.887 [info] [ALICE] New fuzzer  connected
10:26:43.888 [info] [ALICE] Peer info: name=fuzzer, version=0.1.24, protocol=0.6.7 
10:26:43.889 [info] [ALICE] Sending peer info: Jamixir, 0.6.7, 0.6.7 
10:26:43.897 [error] Task #PID<0.198.0> started from #PID<0.196.0> terminating
** (Protocol.UndefinedError) protocol Enumerable not implemented for nil of type Atom. This protocol is implemented
for the following type(s): CubDB.Btree, CubDB.Btree.Diff, CubDB.Btree.KeyRange, Date.Range, File.Stream, Function, G
enEvent.Stream, HashDict, HashSet, IO.Stream, Jason.OrderedObject, List, Map, MapSet, Range, Req.Response.Async, Stream
    (elixir 1.17.3) lib/enum.ex:1: Enumerable.impl_for!/1
    (elixir 1.17.3) lib/enum.ex:166: Enumerable.reduce/3
    (elixir 1.17.3) lib/enum.ex:4423: Enum.map/2
    (jamixir 0.6.7) lib/codec/state/trie.ex:35: Codec.State.Trie.state_keys/1
    (jamixir 0.6.7) lib/codec/state/trie.ex:101: Codec.State.Trie.serialize/1
    (jamixir 0.6.7) lib/codec/state/trie.ex:121: Codec.State.Trie.state_root/1
    (jamixir 0.6.7) lib/storage/storage.ex:99: Storage.put/2
    (jamixir 0.6.7) lib/fuzzer/service.ex:62: Jamixir.Fuzzer.Service.handle_message/3
Function: #Function<0.69725437/0 in Jamixir.Fuzzer.Service.loop_acceptor/2>
    Args: []                                        
```

CC @daiagi 


## Comment by @danicuki

@davxy it seems that you are running `0.6.7` and not `0.6.6` binary


## Comment by @davxy

> [@davxy](https://github.com/davxy) it seems that you are running `0.6.7` and not `0.6.6` binary

Yes, we have a 0.6.7 fuzzer now


## Comment by @daiagi

Hey @davxy 
We have uploaded new version with the bug fixed
We have indeed missed the name field length prefix byte
thank you for the feedback.

For now we  released just 0.6.6 while we fix things on our side to pass the recent traces of 0.6.7

if you could fuzz us again on 0.6.6, that would be great
https://github.com/jamixir/jamixir-releases

Thank you


## Comment by @danicuki

@davxy we just [updated our releases with new working fuzzer ](https://github.com/jamixir/jamixir-releases/releases). Let us now if they are working for you now.


## Comment by @davxy

I tested your version `0.6.7`

Unfortunately, `jamixir` stops as soon as it receives the `SetState` message.

You can find more details in the [notes](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamixir/NOTES.md) I keep in your folder.

I've also added some example binary-encoded messages **without the 4-byte length prefix** here:   [fuzz-proto/examples](https://github.com/davxy/jam-conformance/tree/main/fuzz-proto/examples)

In your specific case, the message that causes the failure is similar to `2_set_state.bin` (encoded using jam-codec).

For easier inspection, I’ve also included a JSON version of the message.



## Comment by @danicuki

@davxy we just submitted [our latest build ](https://github.com/jamixir/jamixir-releases/releases/tag/gp-0.6.7-v0.2.1) with fixes that should solve the previous errors. Let us know if it works now. Cheers


## Comment by @davxy

report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamixir/1754983524

It appears to be a fault caused by an uninitialized ring context during an epoch change.  
I’ve attached the trace from genesis up to the block that triggers the fault, to make reproduction easier.



## Comment by @danicuki

Thanks for the update @davxy . Based on the binaries, I couldn't figure out what operations did you performed on the fuzzer. What calls did you make? What are the contents of the `genesis.bin`? Only the state trie? Or the content of the SetState call? What are the contents of 0000000X.bin? Only blocks? Or binaries of the ImportBlock call? If you could share anything more to help our debugging, we would appreciate.  


## Comment by @davxy

These traces have the exact same format as the ones available [here](https://github.com/davxy/jam-test-vectors/tree/master/traces), so you can ingest them using the same logic. I can also provide JSON files if you think that would help.


## Comment by @danicuki

Our system already passes all the traces. 

But I've tried to decode one of the blocks provided by the fuzzer report. I assumed 00000001.bin was a pure block binary. But it didn't work, don't know exactly why. 

If you could share the json files as well would be great. 

It would help if you could share the pseudo code of the script:
Eg: 

```
1 PeerInfo
2 SetState <header> Genesis.bin
3 ImportBlock 0000001.bin
4 ImportBlock 0000002.bin
...

```

Or something like this

Thanks.




## Comment by @danicuki

I could correctly extract the header from  `genesis.bin`, but the bytes that come after the header are failing when I try to extract the state trie. Also, when I try to decode  0000001.bin as a block, it fails. Please share the jsons, so will be easier for me to debug. Also, let's make sure we both use `0.6.7` (same as in traces, with some few parts from `0.7.0`)


## Comment by @danicuki

another possibility that came to my mind was the chain parameters that may be different in our configs?
here is ours, just in case:
```
config :jamixir, Jamixir,
  # C
  core_count: 2,
  # D
  forget_delay: 32,
  # E
  epoch_length: 12,
  # K
  max_tickets_pre_extrinsic: 16,
  # N
  tickets_per_validator: 3,
  # P
  slot_period: 6,
  # R
  rotation_period: 4,
  # V
  validator_count: 6,
  # Y
  ticket_submission_end: 10,
  # GA
  gas_accumulation: 10_000_000,
```


## Comment by @davxy

> These traces have the exact same format as the ones available [here](https://github.com/davxy/jam-test-vectors/tree/master/traces)

This means that:
- you can reference to any of the JSON files in that folder
- the `nnnnnnnn.bin` files do not contain just a block, but rather the prior state, the block, and the post state (as you can see in [any](https://github.com/davxy/jam-test-vectors/blob/master/traces/storage_light/00000001.json) of the json files)

The trace files are not the messages exchanged between the fuzzer and the target. They follow the same format as the pre constructed traces provided for the test vectors.

I will add this clarification to the spec.
 
Edit: I was planning to upload the JSON for these traces directly here, it was on my agenda. But maybe this comment is already helpful??


## Comment by @danicuki

Hi @davxy, now I got it. I tried to import all 12 blocks here and they went fine. I am wondering if it is something related to the speed of blocks being sent to the fuzzer handler, maybe you are sending blocks faster than it could handle and after some blocks it fails. the `ring_context_not_initialized` is very odd, because ring context is initialized at the start of the process and other blocks would not be imported if it didn't had the ring context initialized. It seems that the process maybe be restarting. 

Are you waiting the fuzzer to respond before making new calls? Or are you sending requests all at once, without waiting for a response?

Can you try to run it again or define some throttling and send blocks slower to see if the error still persists? 

Thank you again for your effort to put this fuzzer to work! Good job!


## Comment by @davxy

> Are you waiting the fuzzer to respond before making new calls? Or are you sending requests all at once, without waiting for a response?

yes before sending any new request I wait for the response. 

> Can you try to run it again or define some throttling and send blocks slower to see if the error still persists?

Even tried with 5 seconds between each request.  
The target crashes when importing a block at step 12 (first block of a new epoch).  

This also happens in fallback mode.  
It seems there is a code path that assumes the ring context is initialized when it is not. No idea :-/



## Comment by @danicuki

@davxy I found the bug that was not correctly initializing the ring context in the fuzzer binary. Updated the [release binaries](https://github.com/jamixir/jamixir-releases/releases/tag/gp-0.6.7-v0.2.2) with the fix. It was not a block speed problem at all.



## Comment by @davxy

Report files: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamixir/1755106159

```
❯ ./jamixir fuzzer --socket-path /tmp/jam.sock --log debug
19:21:17.522 [info] [NODE] 🔧 Starting fuzzer mode
19:21:17.525 [info] [NODE] Setting log level to debug
19:21:17.525 [info] [NODE] Setting log level to debug
19:21:17.525 [info] [NODE] 🟣 Pump up the JAM, pump it up...
19:21:17.533 [debug] [NODE] System loaded with config: [core_count: 2, forget_delay: 32, epoch_length: 12, max_tickets_pre_extrinsic: 16, tickets_per_validator: 3, slot_period: 6, rotation_period: 4, validator_count: 6, ticket_submission_end: 10, gas_accumulation: 1000000]
19:21:17.533 [info] [NODE] 🎭 Starting as fuzzer
19:21:17.537 [info] 💍 Initializing ring context with size 6
19:21:18.212 [info] [NODE] Node running. Type 'q' + Enter for graceful shutdown
19:21:18.216 [info] Ready to be fuzzed on /tmp/jam.sock
19:21:22.263 [debug] New fuzzer connected
19:21:22.264 [info] Peer info: name=fuzzer, version=0.1.24, protocol=0.6.7
19:21:22.265 [info] Sending peer info: Jamixir, 0.2.2, 0.6.7
19:21:22.589 [debug] [NODE][STORAGE] Storing state for header 0xb5af8edad70d962097eefa2cef92c8284cf0a7578b70a6b7554cf53ae6d51222
19:21:22.776 [info] State successfully stored for header hash: 0xb5af8edad70d962097eefa2cef92c8284cf0a7578b70a6b7554cf53ae6d51222
19:21:22.805 [info] Importing block: 0x8a2c121136c29f2bf588a9f29aad83ba0fb3f64f5e8475e933617bb8591875b7
19:21:22.990 [info] Block import failed: work_report_gas_too_high
19:21:29.400 [info] Client disconnected
```

The max total gas usable by the report is set to `10_000_000`, and the maximum allowed is also `10_000_000`, so it should be sufficient. Could it be that you are checking for a strictly-less-than condition? I have not double-checked the GP, but IIRC a `<=` condition should be used.

Also, please ensure you always send a response back to the fuzzer, even if the import fails. Some blocks are intentionally invalid, and failure is expected in those cases. The response to send on failure should be the state root of the last successfully imported block.

You are not the first to miss this, so I have added this detail to the protocol description:
https://github.com/davxy/jam-conformance/blob/main/fuzz-proto/README.md#message-flow



## Comment by @danicuki

In `tiny`, we had `G_A` set to `1_000_000` - probably that's why it is failing. We updated it to `10_000_000` in the [new release](https://github.com/jamixir/jamixir-releases/releases/tag/gp-0.6.7-v0.2.3)


## Comment by @davxy

A couple of new reports: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamixir


## Comment by @danicuki

Updated code fixed the deferred transfer bug. New release:
https://github.com/jamixir/jamixir-releases/releases/tag/gp-0.6.7-v0.2.4

I didn't understand if the report [starting from block 5](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamixir/1755151480) was the continuation of the previous execution or something separate. in case it is a different test, how to I initialize the state? Do I use the pre_state in the block 5? In this case, what should be the previous block header hash? 


## Comment by @davxy

The report folder (together with the report file) includes two trace steps:  
- The step that triggered the failure   (e.g. 00000006.bin)
- The preceding step  (e.g. 00000005.bin)

The preceding step may help some implementations initialize their environment , for example, when they require the full parent block header rather than just its hash.  

If the failure occurs on the first block, the genesis file is provided instead of the preceding step.



## Comment by @danicuki

Ok. I got it. I was just wondering why in other cases you provided all blocks starting from Genesis and this one only the last 2 blocks. 


## Comment by @danicuki

@davxy 

1 - The https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamixir/0.6.7/1755151480 test fails because of accumulation gas difference in statistics. Ours is `10032` and yours is `12072` (diff 2040) - a step-by-step PVM trace / gas consumption table would help to debug. Here are the host calls checkpoints on how we got to `10032`:
```
fetch 51
fetch 416
info 1018
log 2497
fetch 2677
fetch 2981
log 9333
bless 10032
```

2 - Seems to have some mismatch between keys in the storages. The values are correct, but on different keys. In this case, would it be possible for you to provide all blocks, starting from genesis and 0000001, so we can debug when in the flow the keys got changed / lost?


## Comment by @jaymansfield

@danicuki I generated a trace of 1755151480/00000006.bin for you here: https://gist.github.com/jaymansfield/30562b0d54998ad4515b5907b42e4347


## Comment by @davxy

Is the distributed jamixir binary optimized?  
Processing a single block takes several seconds, and since the target is being bombarded with blocks, I’d like to investigate this 


## Comment by @danicuki

@davxy our PVM implementation is interpreted and not optimized. Some blocks are faster than others, but, yes, it is slow now. 


## Comment by @danicuki

@davxy I saw you changed the reports structure and added a traces directory with a bunch of test cases. We will work on the in the next days and get back when we fix all, publishing a new release when we are done 


## Comment by @danicuki

@davxy we just added a [new release](https://github.com/jamixir/jamixir-releases/releases/tag/gp-0.6.7-v0.2.5), with some fixes from previous tests.

These are the cases that were previously failing an are passing now:
```
1754982630
1755186771
1754984893
1755530300
1755530397
1755150174
1754990132
1755530466
```


## Comment by @danicuki

Some cases are failing because of `Refinement context is invalid` 
Because traces don't provide enough previous blocks, we can't find the block ancestors an validade de refinement context (GP Formula 11.35)

e.g: `/1755531265/00000008.json` lookup_anchor refers to slot 5, but we don't have the block 5 to check for previous block header hash.  


## Comment by @danicuki

We also have some tests failing for the same reason. e.g: case `1754982087`:
In our side, we fail to import block 6. According to GP 12.38-12-41, the provided `preimage` in block 6 already exists in state, so this block should not be imported.

Are we missing something?


## Comment by @davxy

hey Daniel, see this discussion: https://github.com/davxy/jam-conformance/issues/8#issuecomment-3201525768


## Comment by @danicuki

@davxy we just run all traces locally and these are the failing tests:

1 - `1755251719`, `1754988078` => delegator difference - Do you have any idea why this could be failing? I am not sure, but from what I saw, the delegator service is not included in the state trie. Is this a fuzzer issue?  
2 - `1755530509`, `1755248982` => storage diff - We are investigating...
3 - `1755531265` => preimage_unneeded (same reason as removed test [commented here](https://github.com/davxy/jam-conformance/issues/9#issuecomment-3201389556)

Please make sure you re-run the tests with our [latest build version](https://github.com/jamixir/jamixir-releases/releases/tag/gp-0.6.7-v0.2.6) that has many fixes.



## Comment by @danicuki

@davxy we have updated our binary with latest version and many bug fixes. Could you please re-generate reports based on this latest version? Thanks!

https://github.com/jamixir/jamixir-releases/releases/tag/0.6.7


## Comment by @danicuki

@davxy we fixed all `0.6.7` issues:
https://github.com/jamixir/jamixir-releases/releases/tag/0.6.7

We are moving to `0.7.0`:
https://github.com/jamixir/jamixir-releases/releases/tag/0.7.0




## Comment by @danicuki

@davxy we updated our binaries with 0.7.0 fixes and performance improvements. 
One thing is intriguing us: fallback blocks run at 10ms here and ~400ms on your environment. Even if my computer can be faster than yours, 40x is too much of a difference. Maybe you are doing something that we are not, so if you could describe exactly what operations are being executed during the performance measurements, would be important for us to find the issues here. Since Elixir uses a VM, we assume you are not considering the fuzzer startup time during these measurements. Let us know! Thanks


## Comment by @daiagi

Adding on @danicuki  comment above.
My computer is also an AMD Ryzen running Linux.
I get mean of about 15ms per fallback block 


## Comment by @davxy

Our strategy for monitoring import times is straightforward and exactly what we need to measure how long a target takes to import a new block:

1. Take a timestamp
2. Send the block to the target
3. Wait for the target to respond with the state root
4. Compute the difference from the initial timestamp
5. (Adjustment) Subtract 5 ms to account for the empirically measured network latency

If your local measurements show significantly lower import times, possible explanations might include:
- Your machine is a lot more powerful (but I have a 64 threads threadripper) 
- Your networking stack
- Block decoding
- Signature verification (depending on whether you verify signatures in your local tests)
- Logging overhead (I noticed you have a lot of logging enabled)
- Any other internal operations we cannot observe/control

**This measurement strategy is applied uniformly to all targets**, which are treated as black boxes.  
There is no special handling for your target in particular.
If my machine were inherently slow, the slowdown would affect all targets equally.

So perhaps the issue lies in one of the factors above. Unfortunately, I cannot investigate further from my side, but if you want to propose something specific, I am happy to try it.



## Comment by @davxy

This is an error I get since the last release:

```
❯ ./jamixir fuzzer --socket-path /tmp/jam-target.sock

18:13:59.996 [info] 🔧 Starting fuzzer mode

18:14:00.000 [info] Setting log level to info
2025-08-31 18:14:00.000 [info] 🟣 Pump up the JAM, pump it up... module=Util.Logger line=17 node=NODE
2025-08-31 18:14:00.008 [debug] System loaded with config: [core_count: 2, forget_delay: 32, epoch_length: 12, max_tickets_pre_extrinsic: 3, tickets_per_validator: 3, slot_period: 6, rotation_period: 4, validator_count: 6, ticket_submission_end: 10, gas_accumulation: 10000000,gas_total_accumulation: 20000000, gas_refine: 1000000000, erasure_coded_piece_size: 4, erasure_coded_pieces_per_segment: 1026] module=Util.Logger line=22 node=NODE
2025-08-31 18:14:00.008 [info] 🎭 Starting as fuzzer module=Util.Logger line=17 node=NODE
** (ArgumentError) errors were found at the given arguments:

  * 1st argument: no persistent term stored with this key

    :persistent_term.get(:memoize_cache_strategy)
    (memoize 1.4.3) lib/memoize/config.ex:29: Memoize.Config.cache_strategy/0
    (memoize 1.4.3) lib/memoize/cache.ex:11: Memoize.Cache.tab/1
    (memoize 1.4.3) lib/memoize/cache.ex:103: Memoize.Cache.do_get_or_run/3
    (jamixir 0.7.0) lib/commands/run.ex:70: Jamixir.Commands.Run.start_node/1
    nofile:1: (file)
    (stdlib 5.2.3) erl_eval.erl:750: :erl_eval.do_apply/7
```


## Comment by @danicuki

Hi @davxy - we've made a change. Could you please test the new updated binary? 


## Comment by @davxy

A lot better now: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.7.0/reports/perf

For safrole my import mean is ~18 ms now

Perhaps you can do even better by having a "verbose" arg to enable debug logs.
Especially in PVM I see a lot of logs there by default


## Comment by @danicuki

@davxy can you run with "--log warning" flag? 



## Comment by @danicuki

@davxy we updated our binary with some optimizations. Would you please update the reports? We also added some logs on fuzzer initialization that print environment characteristics, so we can understand better the differences between your run and ours, as we still see some relevant differences between your runtime and ours in some cases. Please share with us these logs. You can safely start the fuzzer with "--log info", as we reduced the amount of logs in info level



## Comment by @danicuki

@davxy I still see a big difference between your storage import mean time (648ms) and ours (172ms). Would you please share the running logs with "--log debug" activated so we can try to investigate? Also, we see a 💀 on test 1756548459 on your side, but it is normal here. 


## Comment by @danicuki

fixed `1756548706`


## Comment by @danicuki

fixed `1757092821` and better performance in new binaries. 


## Comment by @danicuki

@davxy the mean storage time on your side is `490ms`. On my computer it is `116ms` - if you could send us the fuzzer logs, we need it to analyse why your env is so different. Thanks! 


## Comment by @danicuki

@davxy updated our binaries to fuzzer v1


## Comment by @danicuki

@davxy updated our binaries passing on minifuzzer now


## Comment by @danicuki

`1757862207` is correct here. Would you please re-run with latest version?


## Comment by @davxy

@danicuki Looks like you are returning the bits in the features in the reverse order. I updated minifuzz to check this.


## Comment by @danicuki

@davxy little endian fixed on fuzz features. 

Note: we did some performance improvements and the perf report on your side got worse. I still don't understand that difference. Maybe your tests are running some heavy loaded PVM stuff that are not present in any fuzzer scenario. This is the only explanation, because here we import storage blocks on average in less then 100ms (still high for PVM standards, but 4x faster then your run) 


## Comment by @davxy

Hey @danicuki,

If anyone has doubts about the results, my only suggestion is to run an independent benchmarking.  
(Almost) All implementations binaries - as well as the fuzzer protocol - are public.
Writing a simple script that takes the jam vectors thst I use and send them using the fuzzer protocol is not a huge effort.

Having multiple independent sources confirming the results would indeed be valuable.

The environment I use is the same for all teams.  
It is public and described here:  
https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/README.md#testing-environment

Results may be slightly worse than the last round because of what I said here: https://github.com/davxy/jam-conformance/pull/95


## Comment by @danicuki

Thanks for sharing this. I will try to investigate further. Are the blocks used in the performance tests the same as those in the /storage/ traces folder? 


## Comment by @danicuki

Because Elixir is highly dependent on the Erlang virtual machine, there are specific environment issues that might affect its performance. 

It would be really valuable if you could send us the first lines of your running log, where our fuzzer target prints out all local environment configs, so we can have emulate it locally / or change some specific VM parameters that might be affecting the overall performance on your side. 


## Comment by @danicuki

@davxy we've made an important update to our PVM, now implemented in Rust for better performance. Could you please re-download it. The minifuzz is also already fixed.


## Comment by @danicuki

@davxy binaries updated with latest fixes


## Comment by @danicuki

@davxy binaries updated with latest fixes and performance improvements.


## Comment by @danicuki

@davxy You can use our [0.7.2 binary](https://github.com/jamixir/jamixir-releases/releases/tag/0.7.2) - from what I saw, they support all 0.7.1 changes, with no error as far as I know.


## Comment by @danicuki

@davxy 
We created a [0.7.1 binary](https://github.com/jamixir/jamixir-releases/releases/tag/0.7.1), that should be used because of small differences from 0.7.2 - please re-run the 0.7.1 tests with our  0.7.1 binary.
  


## Comment by @davxy

I've used 0.7.1


## Comment by @danicuki

@davxy code `0.7.1` updated with latests fixes. fuzzy and fuzzy light passing now, as well as all other previously failing reports


## Comment by @danicuki

@davxy I found a mismatch on [this gas value](https://github.com/davxy/jam-conformance/blob/8a9878f9a3d299f39710071c9814c251ea98da0f/fuzz-reports/0.7.1/traces/1761664166/00000081.json#L410). 

The binary is `<<254, 4, 0, 8, 0, 0, 64, 32>>` which should translate to `9077567999442948`, not `9077567999442947` 

I don't know if this affects other parts of the conformance. Maybe it is just a JSON error. Let me know. thanks


## Comment by @davxy

Hey @danicuki, the latest release page ([https://github.com/jamixir/jamixir-releases/releases/latest](https://github.com/jamixir/jamixir-releases/releases/latest)) currently points to **0.7.1**. Would it be possible to update it to point to **0.7.2**? Otherwise, our download script does not work correctly. Thank you.



## Comment by @danicuki

Done


## Comment by @danicuki

@davxy it seems that all our `0.7.2` failing cases happen when the block import fails (and it should actually fail) and we return an error message. I think it was because of messages larger than 128 bytes, when size encoding should use variable size int encoding. I have updated our binary. Could you please check if it is working now? 


## Comment by @davxy

@danicuki @daiagi 

```
❯ ./target.py run jamixir
Running 'jamixir' on docker image
Command: './jamixir fuzzer --log error --socket-path /tmp/jam_target.sock'
Container: 'jamixir-7uid5i'
Image: debian:stable-slim
Image ID: 7097a459326f
Created: 2025-08-11T00:00:00Z
Ensuring no leftover container with name jamixir-7uid5i...
Waiting for target termination (pid=21448)
warning: the VM is running with native name encoding of latin1 which may cause Elixir to malfunction as it expects utf8. Please ensure your locale is set to UTF-8 (which can be verified by running "locale" in your shell) or set the ELIXIR_ERL_OPTIONS="+fnu" environment variable

09:52:28.588 [info] \x{1F527} Starting fuzzer mode

09:52:28.591 [info] Setting log level to error
** (ArgumentError) errors were found at the given arguments:

  * 1st argument: no persistent term stored with this key

    :persistent_term.get(:memoize_cache_strategy)
    (memoize 1.4.3) lib/memoize/config.ex:29: Memoize.Config.cache_strategy/0
    (memoize 1.4.3) lib/memoize/cache.ex:11: Memoize.Cache.tab/1
    (memoize 1.4.3) lib/memoize/cache.ex:103: Memoize.Cache.do_get_or_run/3
    (jamixir 0.7.2) lib/jamixir/node_identity.ex:36: Jamixir.NodeIdentity.node_id_fuzzer/0
    (jamixir 0.7.2) lib/jamixir/node_identity.ex:58: Jamixir.NodeIdentity.initialize!/0
    (jamixir 0.7.2) lib/commands/run.ex:68: Jamixir.Commands.Run.start_node/1
    nofile:1: (file)
Target process exited with status: 1
Cleaning up Docker container jamixir-7uid5i...
```


## Comment by @danicuki

@daiagi this was probably after the new storage path config we made this week


## Comment by @danicuki

@davxy we fixed the initialization issue. Please try again. 


## Comment by @davxy

@daiagi @danicuki  You target start failing with the following error (with all the traces):

```
07:57:53.271 [info] Setting log level to error
2026-02-13 07:58:00.302 [error] Task #PID<0.285.0> started from #PID<0.276.0> terminating
** (Exqlite.Error) no such table: blocks
INSERT INTO "blocks" ("slot","header_hash","parent_header_hash","applied") VALUES (?1,?2,?3,?4) ON CONFLICT ("header_hash") DO NOTHING RETURNING "header_hash"
    (ecto_sql 3.13.2) lib/ecto/adapters/sql.ex:1098: Ecto.Adapters.SQL.raise_sql_call_error/1
    (ecto 3.13.3) lib/ecto/repo/schema.ex:1000: Ecto.Repo.Schema.apply/4
    (ecto 3.13.3) lib/ecto/repo/schema.ex:500: anonymous fn/15 in Ecto.Repo.Schema.do_insert/4
    (jamixir 0.7.2) lib/storage/storage.ex:57: Storage.put/1
    (jamixir 0.7.2) lib/storage/storage.ex:137: Storage.put/2
    (jamixir 0.7.2) lib/node.ex:42: Jamixir.Node.add_block/2
    (jamixir 0.7.2) lib/fuzzer/service.ex:131: Jamixir.Fuzzer.Service.handle_message/3
    (jamixir 0.7.2) lib/fuzzer/service.ex:38: Jamixir.Fuzzer.Service.handle_client/2
Function: #Function<0.71960264/0 in Jamixir.Fuzzer.Service.loop_acceptor/2>
    Args: []
^CCleaning up Docker container jamixir-y5m9dr...
```


## Comment by @danicuki

Hi @davxy  - Thanks for the feedback. We just updated the release with a fix that creates the missing database table.  
