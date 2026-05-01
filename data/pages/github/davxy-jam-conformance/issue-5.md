---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/5'
title: Vinwolf
site: github.com/davxy/jam-conformance
created_at: '2025-08-01T11:47:44.000Z'
last_modified: '2025-08-01T11:47:44.000Z'
content_kind: issue
---

# Vinwolf

## Issue by @bloppan

Hi @davxy, thank you for the feedback!

Could you please share the PVM traces of https://github.com/davxy/jam-stuff/blob/main/fuzz-reports/0.6.6/vinwolf/vinwolf-target-0.1.0_GP-0.6.6/1753948533/00000015.bin ?


Regards.


## Comment by @davxy

https://github.com/davxy/jam-stuff/blob/main/fuzz-reports/0.6.6/vinwolf/vinwolf-target-0.1.0_GP-0.6.6/1753948533/pvm-trace.log


## Comment by @davxy

Do you have a target for version 0.6.7? I'm currently shifting my focus to that protocol revision.
We also published collecting feedback about test vectors https://github.com/davxy/jam-test-vectors/pull/87


## Comment by @bloppan

Thanks for the pvm trace @davxy ! 
I will take a look at it. I will publish a new target for version 0.6.7 in the next comming days.


## Comment by @bloppan

Hi @davxy !,

1753948533/00000015.bin should be fixed now. There was an issue with my lookup host function: I was always trying to write 32 bytes [instead of 'l' bytes.](https://graypaper.fluffylabs.dev/#/9a08063/325a03325b03?v=0.6.6)

I updated the target binaries in my repo https://github.com/bloppan/conformance_testing

I'm going to update my implementation to v0.6.7 and try the new set of test vectors. 


## Comment by @bloppan

Hi @davxy , could you please share the pvm traces for archive/0.6.7/1754982087 ?  It's the only one that Im not able to pass in the archive directory.

My target binary is updated to v0.6.7 and ready for fuzz https://github.com/bloppan/conformance_testing




## Comment by @davxy

Looks like your target dies when receiving the SetState message.

```log
❯ ./run_target.sh vinwolf
Run vinwolf on targets/vinwolf/6b12087

vinwolf-target v0.6.7 listening on /tmp/jam_target.sock

Waiting for target termination (pid=98767)
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] New incomming connection accepted...
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] New message from fuzzer with length: 14 bytes
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] Fuzzer info: "fuzzer" version: 0.1.24 protocol version: 0.6.7
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] Target info: "vinwolf-target" version: 0.1.0 protocol version: 0.6.7
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] New message from fuzzer with length: 414453 bytes
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] SetState frame received
Not enough data at position: 219268, length 1
[2025-08-16T07:29:52Z ERROR vinwolf_target::fuzz] Failed to decode the state key-values: NotEnoughData
[2025-08-16T07:29:52Z INFO  vinwolf_target::fuzz] SetState - same state root 0000000000000000000000000000000000000000000000000000000000000000

thread 'main' (98769) panicked at vinwolf-target/src/fuzz.rs:70:18:
Unknown message type
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Make sure you can decode the sample `set_state` message in the examples folder (https://github.com/davxy/jam-conformance/tree/main/fuzz-proto/examples).
The binaries in the `examples` **do not include the 4-byte length prefix**.  
Messages received from the socket **will include the 4-byte prefix**.

> pvm traces for archive/0.6.7/1754982087

ok


## Comment by @davxy

Actually for `1754982087`, there is no PVM trace because execution doesn't happen.  
This is expected: the blob cannot be loaded (it hasn’t been provided yet).

It is provided in the extrinsic, but preimage integration happens after accumulation (as per 12.4)


## Comment by @bloppan

Thanks for the feedback, @davxy . I don't know what's happening, I can decode properly `set_state` message in the examples folders and we also did a couple of fuzz sessions in v0.6.6... 

Maybe the problem could be in my reception buffer, so I have made some changes on it and I added more logs traces in order to debug this issue. 

I have updated my binary target https://github.com/bloppan/conformance_testing 

If it still fails, please share the target's log.

Cheers.




## Comment by @davxy

Fine now it works!!! I'll try your target better on monday. 
In the meantime you may want to check `archive/1755248982` which is failing. 
The others are passing


## Comment by @bloppan

Hi @davxy , `1755248982` should be fixed now. 

I've updated my binary target: https://github.com/bloppan/conformance_testing




## Comment by @davxy

Is the distributed vinwolf binary optimized?
Processing some blocks (especially where PVM is used) takes 1+ seconds, and since the target is being bombarded with blocks, I’d like to investigate this


## Comment by @bloppan

@davxy is actually not very optimised since the entire block processing is currently made sequentially (only one thread is running).


## Comment by @bloppan

Hi @davxy the reports `1755248982`, `1755530300`, `1755530509`, `1755531265` are fixed now in my new release 

`vinwolf-target-0.1.2
`
https://github.com/bloppan/conformance_testing


## Comment by @bloppan

Hi @davxy the report 1755796851 is fixed. My info host-call was returning the wrong account, now vinwolf is passing all the traces 😃

New release available: 

`vinwolf-target-0.1.3`
https://github.com/bloppan/conformance_testing


Cheers.


## Comment by @bloppan

Hi @davxy! I've updated my target binary for version 0.7.0.

`vinwolf-target-0.2.0`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @bloppan

Fixed stats order in the new release available, @davxy 

`vinwolf-target-0.2.1`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @bloppan

Hi @davxy,
I've removed a significant bottleneck from my PVM. This new version should improve performance in tests that require PVM execution.

There are still many things to optimise in my implementation, since I have only focused on correct behaviour so far, but this update should improve things for vinwolf.

`vinwolf-target-0.2.2`
https://github.com/bloppan/conformance_testing

I also added support for macos @alxmirap 

Cheers.




## Comment by @bloppan

Hi @davxy , 

I fixed the trace `1756548706`. I was checking the wrong lookup key in the eject hostcall.

The trace `1756548916` for which [I set the **W_E** value incorrectly](https://github.com/davxy/jam-conformance/discussions/42) is also fixed in my new release.

Vinwolf should now pass all traces.

`vinwolf-target-0.2.3`
https://github.com/bloppan/conformance_testing


Cheers.





## Comment by @bloppan

The new release has significant performance improvements, @davxy 

`vinwolf-target-0.2.4`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @bloppan

Hi @davxy ! I did some performance improvements to my target. 

`vinwolf-target-0.2.8`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @bloppan

The report 1757062927 is fixed in my new target release, @davxy 

`vinwolf-target-0.2.9`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @bloppan

Hi @davxy , my new target release resolves all remaining disputed reports. It also supports simple forks. 

I will update the fuzz protocol to v1 in the coming days, I will let you know when it is ready.

`vinwolf-target-0.2.10`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @bloppan

Hi  @davxy , the new release supports the fuzz protocol v1. At the moment it only has enabled the simple fork feature, the next release will have support for Ancestors as well.

`vinwolf-target-0.2.11`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @davxy

It seems the target stops accepting PeerInfo after the first session.  
When I close the socket and reopen it to start a new session, I send PeerInfo, but the target does not respond.



## Comment by @bloppan

Thanks @davxy , I've updated the binary so that it accepts new connections after the first session. It works fine in my environment with my own fuzzer. Let me know if the problem persists.


`vinwolf-target-0.2.12`
https://github.com/bloppan/conformance_testing

Cheers.


## Comment by @davxy

works


## Comment by @bloppan

Hi @davxy  I resolved the disputed reports 1757862468, 1757862472, 1757862743 in the last binary release. 

Two of them were failing due to I forgot set `L = 24` in tiny mode. 

In the other one, I wasn't doing the simple fork process properly. There is a sentence in the [proto-fuzz description](https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#typical-workflow) that confused me when I was implementing the simple fork process: _The chain is always extended from the original block — i.e. mutations are never used as parents for subsequent blocks._ So in my implementation I was trying to extend from the first correct block imported during the fork process.  Anyway, you post few days ago a [very clear explanation](https://github.com/davxy/jam-conformance/discussions/71#discussioncomment-14360978) about how the fork process works and I refactored my code following that.

`vinwolf-target-0.2.13`

Happy week 😃


## Comment by @bloppan

Hi @davxy I've updated the target binary with some improvements in the communication between the target and the fuzzer. 

It passes all the steps in the examples using minifuzz. 

Also pass all the disputed reports.

`vinwolf-target-0.2.14`

Cheers.


## Comment by @bloppan

Hi @davxy , I've updated the target binary with several optimisations, let's see how they work in the next perf round.

`vinwolf-target-0.2.15`

Happy week!


## Comment by @davxy

@bloppan I belive you have a huge regression.
Almost all the traces for 0.7.0 are now failing

```
🔴 1756548459
🔴 1756548583
🔴 1756548667
🔴 1756548706
🔴 1756548741
🔴 1756548767
🔴 1756548796
🔴 1756572122
🟢 1756790723
🟢 1756791458
🟢 1756814312
🔴 1756832925
🟢 1757062927
🟢 1757092821
🔴 1757406079
🔴 1757406238
🔴 1757406356
🟢 1757406441
🔴 1757406516
🔴 1757406558
🔴 1757406598
🔴 1757421101
🔴 1757421743
🔴 1757421824
🟢 1757421952
🟢 1757422106
🔴 1757422178
🔴 1757422206
🟢 1757422550
🔴 1757422647
🔴 1757422771
🔴 1757423102
🔴 1757423195
🔴 1757423271
🔴 1757423365
🟢 1757423433
🟢 1757423902
🔴 1757841566
🔴 1757842797
🔴 1757842852
🟢 1757843609
🔴 1757843719
🔴 1757843735
🔴 1757861618
🔴 1757862207
🔴 1757862468
🔴 1757862472
🟢 1757862743
```


## Comment by @bloppan

Wow @davxy , it's weird because I pass all of them when I try it in my laptop... Not sure what can be happening.

In your environment I'm only passing the traces that returns an error. Maybe the failing traces are also returning an error to the fuzzer, can you tell me if in the report 1756548459 I'm returning an error and what error is?

Another question: do you send to the target the pre_state of the first trace on each report?




## Comment by @davxy

- You always return `HeaderError(BadParentHeader)` Error message
- On each session (aka each trace folder). The fuzzer opens the socket, sends PeerInfo and Initialize as per protocol description. At the end of the session we close the sock


## Comment by @bloppan

Hi @davxy , I've updated the target:

- Old versions: I was skiping the parent header's check of the first block received. 
- Version 0.2.15: In Initialize, I stored the parent header of the header received as the last valid parent header received.
- Now (version 0.2.16): In Initialize, I'm storing the Blake2 hash of the header received as the last valid parent header received.

Let me know if the problem persists. 

`vinwolf-target-0.2.16`


## Comment by @davxy

The issue is still there. The same traces are failing.

> You always return HeaderError(BadParentHeader) Error message



## Comment by @bloppan

I've updated the target, @davxy this should work now... It should also pass all the new disputed reports except this one: https://github.com/davxy/jam-conformance/discussions/99

`vinwolf-target-0.2.17`


## Comment by @bloppan

Hi @davxy , the new vinwolf-target supports 0.7.1.

`vinwolf-target-0.3.0`

Cheers.


## Comment by @bloppan

Hi @davxy , the new binary target passes all new fuzzy traces.

`vinwolf-target-0.3.1`

Happy week!


## Comment by @bloppan

Hi @davxy , I've updated the target, now pass the first 0.7.1 reports batch and all new fuzzy (and fuzzy_light) traces .

`vinwolf-target-0.3.3`

Cheers.


## Comment by @bloppan

Hi @davxy , the new target pass all traces and 0.7.1 reports published.

`vinwolf-target-0.3.4`

Cheers.


## Comment by @bloppan

Hi @davxy , the new release passes all traces and 0.7.1 reports

`vinwolf-target-0.3.5`

Cheers.


## Comment by @bloppan

Hi @davxy , the last release passes all v0.7.2 traces and test vectors.

`vinwolf-target-0.3.6`

Cheers.


## Comment by @bloppan

Hi @davxy  , the last release passes all v0.7.2 disputed reports.

`vinwolf-target-0.3.7`

Merry Christmas! :)


## Comment by @bloppan

Hi @davxy  , the last release passes all disputed reports of the new year batch.

`vinwolf-target-0.3.9`

Cheers.


## Comment by @bloppan

Hi @davxy I've published the docker image ghcr.io/bloppan/vinwolf-target:latest which implements the standard target packaging env vars.

Please let me know if you find any issues.

`vinwolf-target-0.3.14`

Cheers.
