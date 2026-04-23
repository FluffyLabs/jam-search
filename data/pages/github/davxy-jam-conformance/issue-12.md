---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/12'
title: "Jamzilla \U0001F996"
site: github.com/davxy/jam-conformance
created_at: '2025-08-09T13:47:19.000Z'
last_modified: '2025-08-09T13:47:19.000Z'
content_kind: issue
---

# Jamzilla 🦖

## Issue by @ascrivener

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7

ready for action


## Comment by @davxy

@ascrivener see the notes here: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/1754754655

*Edit:* The encoded messages [here](https://github.com/davxy/jam-conformance/tree/main/fuzz-proto/examples) **do not** include the 4-byte prefix containing the payload length.  
That prefix is only added when the data is sent over the socket.


## Comment by @ascrivener

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.1

my setstate accidentally included the state root as well as the state, a la the genesis vector, whoops. should be fixed


## Comment by @davxy

Still fails on `SetState` message. Now this is the error:
```
❯ ./jamzilla-fuzzserver-full-amd64-linux -socket /tmp/jam_conformance.sock
2025/08/10 11:12:00 JAM Fuzzer Interface Server
2025/08/10 11:12:00 Socket path: /tmp/jam_conformance.sock
2025/08/10 11:12:00 Fuzzer interface listening on /tmp/jam_conformance.sock
2025/08/10 11:12:18 New fuzzer connection accepted
2025/08/10 11:12:18 Handshake received from fuzzer: fuzzer (App v0.1.24, JAM v0.6.7)
2025/08/10 11:12:18 Error receiving message: extra 55946 bytes left after deserialization (data: 0000000000...
```

Have you tried to decode the `SetState` message as described here:
https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamzilla/1754754655/NOTES.md ?

As I said, the binaries do not include the length prefix. So, on the wire you'll receive first 4 bytes with the length of what follows



## Comment by @ascrivener

hmm yes I tried it with 0_peer_info.bin and then 2_send_state.bin and get 

go run send_bin.go 0_peer_info.bin 2_set_state.bin
Connected to socket /tmp/jam_target.sock

--- Sending file 1: 0_peer_info.bin ---
Sending 0_peer_info.bin (14 bytes)...
  Length prefix: 0e000000
  Successfully sent 0_peer_info.bin
Waiting for response...
  Response length: 16 bytes
  Response received: 16 bytes
  Response data: 00086a616d2d6e6f6465000100000607

--- Sending file 2: 2_set_state.bin ---
Sending 2_set_state.bin (177491 bytes)...
  Length prefix: 53b50200
  Successfully sent 2_set_state.bin
Waiting for response...
  Response length: 33 bytes
  Response received: 33 bytes
  First 32 bytes: 0576acb3326996df5eb7555790b7a60a9a8d519e4fae3e6a4ef906dcc3bedbc2...

All files sent successfully!


and from the fuzz server:

05:00 debug layer=debugger continuing
2025-08-10T23:14:07+05:00 debug layer=debugger ContinueOnce
2025/08/10 23:14:07 JAM Fuzzer Interface Server
2025/08/10 23:14:07 Socket path: /tmp/jam_target.sock
2025/08/10 23:14:07 Fuzzer interface listening on /tmp/jam_target.sock
2025/08/10 23:14:12 New fuzzer connection accepted
2025/08/10 23:14:12 Handshake received from fuzzer: fuzzer (App v0.1.24, JAM v0.6.7)
2025/08/10 23:14:12 State set successfully, state root: 76acb3326996df5eb7555790b7a60a9a8d519e4fae3e6a4ef906dcc3bedbc2b8
2025/08/10 23:14:12 Fuzzer disconnected




## Comment by @ascrivener

the above was run using the release i made at 

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.1

specifically [jamzilla-fuzzserver-tiny-arm64-darwin](https://github.com/ascrivener/jamzilla-conformance-releases/releases/download/v0.6.7.1/jamzilla-fuzzserver-tiny-arm64-darwin) on macos

can you confirm this is the executable you're using? the linux tiny should also work similarly


## Comment by @davxy

I’m running Linux on amd64. I’ll try again, just in case, and if needed, I’ll send you the exact raw data I’m transmitting to your target over the wire. I'm AFK tomorrow


## Comment by @ascrivener

Thanks. Then this should be the right version https://github.com/ascrivener/jamzilla-conformance-releases/releases/download/v0.6.7.1/jamzilla-fuzzserver-tiny-amd64-linux


## Comment by @davxy

Okay, my mistake, the protocol works. I accidentally chose the "full" version instead of the "tiny" one. I’ll get back to you with a report.


## Comment by @davxy

report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/jam-node-0.1.0_gp-0.6.7/1754984893


## Comment by @ascrivener

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.2

that report should now be obsolete with the above release


## Comment by @davxy

report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/jam-node-0.1.0_gp-0.6.7/1755082451


## Comment by @ascrivener

https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamzilla/jam-node-0.1.0_gp-0.6.7/1755082451/00000012.json#L100-L125

I think this is wrong if I'm understanding (6.27) correctly?

<img width="583" height="134" alt="Image" src="https://github.com/user-attachments/assets/aa08808d-e146-4d98-b4e6-89ca943702ee" />

it should be in the same order as the post state active validator keys, which it doesn't appear to be

(https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamzilla/jam-node-0.1.0_gp-0.6.7/1755082451/00000012.json#L211-L214)


## Comment by @ascrivener

Also FYI i made https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.3 for some changes unrelated to the above


## Comment by @davxy

> it should be in the same order as the post state active validator keys

In 6.23: that is the posterior safrole state (aka the next epoch validators)


## Comment by @ascrivener

whoops. fixed: https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.4


## Comment by @ascrivener

hi @davxy just making sure you saw this


## Comment by @davxy

new one: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/1755184602

Side note: is possible for you to send `jamzilla` in the "name" section of the PeerInfo message? Ty


## Comment by @ascrivener

http://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.5

done and done


## Comment by @davxy

+1


## Comment by @ascrivener

can you confirm code hash is meant to be all zeros after 00..08.json? Seemed odd to me


## Comment by @ascrivener

ignore^ 

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.7

can i have at least 3 more failures? thanks :)


## Comment by @ascrivener

For [jam-conformance/fuzz-reports/jamzilla/0.6.7/1755252727](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/0.6.7/1755252727), I have 2 points:

1. It seems the ticket indices (e.g. https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamzilla/0.6.7/1755252727/00000011.json#L130) are being encoded / decoded as a single byte, but I think according to GP they should use the generic encoding (https://graypaper.fluffylabs.dev/#/7e6ff6a/3a60023a6002?v=0.6.7 + https://graypaper.fluffylabs.dev/#/7e6ff6a/0d0b010d0b01?v=0.6.7)

2. I believe (6.28) fails https://graypaper.fluffylabs.dev/#/7e6ff6a/0ea8030ea803?v=0.6.7, since e' > e yet Hw is not nil


## Comment by @ascrivener

For https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/0.6.7/1755251719:

relevant GP bit: https://graypaper.fluffylabs.dev/#/7e6ff6a/177102177702?v=0.6.7

We first get the designate service index (1748344414) for the manager service (0), then we compute the single service accumulation for 1748344414. since 1748344414 is not in service accounts map, we return early with o (notice this is the ORIGINAL o, not the o after running the single service accumulation for 0). This o's designate service index is 0, as that's what it was before running accumulate for service index 0.

Please let me know if I'm interpreting GP wrong here, or if you think GP needs modification.


## Comment by @davxy

- 1755252727: this is a mutation and is expected to fail. The issue is that your target doesn't send back the last correctly imported block root (see **import failures** section [here](https://github.com/davxy/jam-conformance/blob/main/fuzz-proto/README.md#message-flow))

- 1755251719: I'm not sure, but from your target logs looks like you're failing for a different reason.
 
log for 1755251719

```
❯ ./run_target.sh jamzilla
Run jamzilla on targets/jamzilla/v0.6.7.7
2025/08/16 09:02:47 JAM Fuzzer Interface Server
2025/08/16 09:02:47 Socket path: /tmp/jam_target.sock
2025/08/16 09:02:47 Fuzzer interface listening on /tmp/jam_target.sock
2025/08/16 09:02:49 New fuzzer connection accepted
2025/08/16 09:02:49 Handshake received from fuzzer: fuzzer (App v0.1.24, JAM v0.6.7)
2025/08/16 09:02:49 State set successfully, state root: 1dae04cd539886a4d49244595f5c015cede2bfac08b535d926a6eed313e3ee1b
2025/08/16 09:02:49 Failed to process block: failed to verify block: failed to get anchor block: failed to get block in chain with hash 637ad6a26feacdd5b0040a36a085756f22332f07327c75be8d38efdd3c8f4801: failed to get block 637ad6a26feacdd5b0040a36a085756f22332f07327c75be8d38efdd3c8f4801: pebble: not found
2025/08/16 09:02:49 Returning state for header hash 594fb2e32bad74c6dd7c79134e687af0725a1b39315e7e57f4b1b93aec12bc9d with 21 key-value pairs
2025/08/16 09:02:49 Fuzzer disconnected
Waiting for target termination (pid=73781)
```

Looks like you fail to get an anchor with hash `637ad6a26feacd....8efdd3c8f4801`. But the report anchor is the prev block: `594fb2e32bad74c6...`


## Comment by @ascrivener

Thanks, i made https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.8 which fixes a few things, but may not fix the anchor block issue.

One issue with only getting the last block in the ancestor chain in the test vectors is that I can't always debug if the anchor block actually is in the full ancestor chain to check if (11.35) should pass or fail. I ran v0.6.7.8 on 1755251719 and it fails, but because it can't find bc35daf118a254f722c8aee4173abe42273146b0df0455412e80385a976c34c0 in the ancestor chain, because only 594fb2e32bad74c6dd7c79134e687af0725a1b39315e7e57f4b1b93aec12bc9d is present in the ancestor test vector chain (28.json).

bc35daf118a254f722c8aee4173abe42273146b0df0455412e80385a976c34c0 is a lookup anchor in the work report's refinement context in the guarantees extrinsic for 29.json, so it must appear in the ancestor chain according to 11.35


## Comment by @ascrivener

Would it be possible to provide the binary of the actual importblock message sent instead of just the binary of the pre_state + block + post_state? in the case that the block actually can't be decoded for whatever reason (e.g. due to uint8 ticket indices instead of generically decoded), it makes it challenging for my test code to tease apart the poorly-encoded block bytes from the pre_state + block + post_state binary file. Not a huge deal if not, just to keep things simpler for you

That is, assuming that we expect some of the imported blocks to indeed be impossible to decode due to incorrect encoding. Can you verify that for M1 we must be able to handle importblock bytes that are impossible to decode?

Can you also verify that the block for 1755252727 is MEANT to be poorly encoded (with uint8 ticket indices instead of generically-encoded)?


## Comment by @davxy

Let's first try to address `1755251719`  (I'm referring to step 00000029.bin)

1. The 11.35 check happens when the report is placed in the core’s pending availability `ρ`.  
   That step has already been done since you find the report already there.  
   In the trace you’re processing, the core item that became *already available*, you just need to process it.  
   (IIUC No need to run the 11.35 check again)

2. This isn’t directly relevant (since the check isn’t applied), but for context:  
   the report you need to process (for work package `0x6958fba4d9220288...`)  
   has both its anchor and lookup anchor set to the block with hash `0xa2b29c3dcce95003...` (why you need 0xbc35...)?

3. The state is sufficient; nothing else is required.  
   If you inspect the recent block history in the state, you’ll find the following entries:

```
RECENT BLOCKS:
0xe4d7ceb47eab9462...
0xe2a2f76ccde14c07...
0x1fff97091c6d29f4...
0x5c6a9bc461fa6ab3...
0xbc35daf118a254f7...
0xa2b29c3dcce95003...
0x637ad6a26feacdd5...
0x594fb2e32bad74c6...
 ```

Which include the anchor (0xa2b29c3dcce95003 as well as the anchor 0xbc35...)

Have you correctly applied these changes: https://github.com/gavofyork/graypaper/pull/405 ?


## Comment by @ascrivener

Yes I believe so. My understanding is that 11.35 is run for every guarantee extrinsic's refinement context, and so it must be run on block 29. 

Also, the state is not sufficient on its own. In fact the blob above 11.35 explicitly states as such. "this is one of
the few conditions which cannot be checked purely with on-chain state"

<img width="613" height="255" alt="Image" src="https://github.com/user-attachments/assets/65733a3c-405c-4a9c-8724-152c05a320d7" />


Finally, block 29 has 0xbc35daf118a254f722c8aee4173abe42273146b0df0455412e80385a976c34c0 as a lookup anchor in the guarantees extrinsic https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamzilla/0.6.7/1755251719/00000029.json#L121, so according to GP we must look at the past L time of blocks (NOT necessarily in the recent blocks state component) to verify we have a record of it. That's why my code doesn't look at recent blocks: even if it did, in order to remain GP compliant it would have to default to the non-state block record it's maintaining if it doesn't find it, and just looking at the record directly is simpler.


## Comment by @ascrivener

Can you please re-run on https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.8  ? it might be that since an earlier block failed, it did not have the anchor block in the in-memory db i'm using anymore, and i believe I've already fixed this behavior (though it's impossible for me to test it without the full chain of test vector blocks imported)

In any case, I believe a problem still remains with only having the previous successful block (and the post state) in the test vectors: this check which relies on something other than pure on-chain state cannot be verified fully with only 2 blocks (even with warp syncing the post state), the anchor may be earlier than that, earlier than the recent blocks state component even


## Comment by @davxy

> block 29 has 0xbc35daf118a254f722c8aee4173abe42273146b0df0455412e80385a976c34c0 as a lookup anchor in the guarantees extrinsic

Now I see what you mean, sorry. You are not talking about what you are accumulating, but about the new report that arrives.

That said, looks like 11.35 is indeed problematic for the current fuzzer design!  
It might also be an issue for warp sync.  
Warp sync provides some finalized state, and the chain catches up later.  
But this check prevents importing blocks with guarantees until the chain has caught up, which makes warp essentially almost useless.  
I need to bring this up with the team.

For the fuzzer is easy, perhaps  we should bundle **A** (the ancestor set) together with the report steps,  so that you can import the ancestors set as well.  But this doesn't resolve my doubts about warp sync

Good catch BTW


## Comment by @ascrivener

Thanks for re-running, looks like 1755251719 still fails. I still believe in my previous analysis of this above:



> For https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzilla/0.6.7/1755251719:
> 
> relevant GP bit: https://graypaper.fluffylabs.dev/#/7e6ff6a/177102177702?v=0.6.7
> 
> We first get the designate service index (1748344414) for the manager service (0), then we compute the single service accumulation for 1748344414. since 1748344414 is not in service accounts map, we return early with o (notice this is the ORIGINAL o, not the o after running the single service accumulation for 0). This o's designate service index is 0, as that's what it was before running accumulate for service index 0.
> 
> Please let me know if I'm interpreting GP wrong here, or if you think GP needs modification.


Any thoughts? The only difference between my impl's post state and polkajam's is that the designate service index is 0 for jamzilla vs 1748344414


## Comment by @ascrivener

A few things:
- New release which removes the (11.35) lookup anchor block check. This is temporary until the fuzzer tests add ancestor blocks. Will this be added soon? https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.9
- It only fails on archive issues related to my previous comment (designate service index mismatch). Can you take a look at my analysis above when you're next available?
- Can you confirm if the polkajam impl is correctly using the generic encoding for ticket indices? (Or if I'm misreading the GP) (https://graypaper.fluffylabs.dev/#/7e6ff6a/3a60023a6002?v=0.6.7 + https://graypaper.fluffylabs.dev/#/7e6ff6a/0d0b010d0b01?v=0.6.7)
- Should we expect the fuzzer to make poorly-encoded test vectors?


## Comment by @davxy

> Any thoughts? The only difference between my impl's post state and polkajam's is that the designate service index is 0 for jamzilla vs 1748344414

I see your point. If we take the GP literally, then $v'$ would equal $v$ as derived from the accumulation of $v*$. However, since $v*$ does not exist, we need to retain the previous value instead.

Technically, you are correct. That said, for version 0.6.7 we will leave it as it is, since the checks are revised and corrected in 0.7. In short, 0.6.7 was flawed in this regard.




## Comment by @ascrivener

Ok. It looks like the issue persists in 0.7.0. We should probably add that the parallelized accumulation for the fuzzer is defined as in 0.7.1? (with 12.20 especially)


## Comment by @davxy

> Can you confirm if the polkajam impl is correctly using the generic encoding for ticket indices? (Or if I'm misreading the GP) (https://graypaper.fluffylabs.dev/#/7e6ff6a/3a60023a6002?v=0.6.7 + https://graypaper.fluffylabs.dev/#/7e6ff6a/0d0b010d0b01?v=0.6.7)

What do you mean?

E.g. given 
ticket_id = [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 0a, 0b, 0c, 0d, 0e, 0f, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1a, 1b, 1c, 1d, 1e, 1f]
and attempt = 1

Should be encoded as:
[00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 0a, 0b, 0c, 0d, 0e, 0f, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1a, 1b, 1c, 1d, 1e, 1f, 01]

> Should we expect the fuzzer to make poorly-encoded test vectors?

Not planned. Syntax should always be correct. Only semantically incorrect (e.g. ticket index with a not allowed value, an epoch mark when is not expected, etc). You said you encountered some poorly encoded trace?

> Ok. It looks like the issue persists in 0.7.0. We should probably add that the parallelized accumulation for the fuzzer is defined as in 0.7.1? (with 12.20 especially)

Yes, this was fixed in 0.7.1.  

I can add a note, but not in the sense that we are following 0.7.1.  
We are actually following 0.6.7, with the only exception we discussed: we do not attempt to accumulate non-existing services.  
Especially because we only accumulate reports that became available, and there is nothing available for the new service. For the new service, there is simply nothing to accumulate.  

Also, according to 0.6.7, if $v*$ is accumulated (not the case for the trace we're talking about, but  just for the sake of discussion), there are two possible outcomes for $v'$:  

- it changed the value in `o_v`, then we use the new value.  
- If it did not change the value, then the value is reset to the original $v$ (WARN: **not $v*$**),  
  since `o` was not modified. As a result, the changes made by `$m$` are effectively lost.  This was the main flaw.



## Comment by @ascrivener


> E.g. given ticket_id = [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 0a, 0b, 0c, 0d, 0e, 0f, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1a, 1b, 1c, 1d, 1e, 1f] and attempt = 1
> 
> Should be encoded as: [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 0a, 0b, 0c, 0d, 0e, 0f, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1a, 1b, 1c, 1d, 1e, 1f, 01]

In 1755252727, we have 

{
    "id": "0x865009acf92b7072992548b56cd73e6eb850a5a4275d057b38e6cbe85a9b0f46",
    "attempt": 148
},

as the first index in tickets_mark. In the binary this appears as

865009acf92b7072992548b56cd73e6eb850a5a4275d057b38e6cbe85a9b0f46 | 94

So 148 seems to be serialized as though it's a byte (0x94 is 148 in decimal), but according to (https://graypaper.fluffylabs.dev/#/7e6ff6a/3a60023a6002?v=0.6.7 + https://graypaper.fluffylabs.dev/#/7e6ff6a/0d0b010d0b01?v=0.6.7) it should be serialized according to the general natural encoding https://graypaper.fluffylabs.dev/#/7e6ff6a/39af0039af00?v=0.6.7, under which 148 becomes 0x8094 I believe.

> Not planned. Syntax should always be correct. Only semantically incorrect (e.g. ticket index with a not allowed value, an epoch mark when is not expected, etc). You said you encountered some poorly encoded trace?

Only blocks with tickets_mark are "poorly encoded" according to jamzilla, due to the dispute of how to encode ticket attempt number




## Comment by @ascrivener

actually also related, the ticket's entry index must be less than N, which for tiny is = 3. but the attempt # goes up to 255 (also 255 is more evidence that it's limited by byte values, and thus incorrectly using the simple encoding rule for 1 byte values). Either GP must be updated here https://graypaper.fluffylabs.dev/#/7e6ff6a/3a60023a6002?v=0.6.7, or polkajam should switch to using the general natural number encoding for the ticket entry index


## Comment by @davxy

I'll change the fuzzer to produce attempt values that are low enough to remove the issue (compact enc equal to non compact).
Then I'll switch to compact encoding in polkajam (as future black box mutations - with bit flipping - may trigger this condition anyway)
 Ty for reporting


## Comment by @ascrivener

no problemo. This should pass all archived tests now, once you make the ticket entry index value + encoding method changes
https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.10


## Comment by @ascrivener

I suppose also a block should be invalid if it has a ticket with index >= N ? I don't have this check yet and I suppose most don't


## Comment by @ascrivener

I'm feeling fairly confident that gas usage isn't being tracked correctly for polkajam sometimes.

1755531480
1755531419
1755531375
1755531322
1755531229
1755530535

The only difference between jamzila and polkajam in these tests is that polkajam has 0 gas usage in the service stats for service index 3202820706


## Comment by @davxy

You mean in the stats? I'll have a look as soon as I'm back to the keyboard


## Comment by @ascrivener

yes the service stats in the validator statistics component


## Comment by @ascrivener

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.6.7.11

Should pass all non-retired tests now


## Comment by @ascrivener

Please change label to 0.7.0


## Comment by @ascrivener

1756548706 is clear


## Comment by @davxy

1756548706 still fails here. Perhaps you've not updated your binary? 


## Comment by @ascrivener

ah I only updated the main branch for jamzilla-conformance-releases. didn't realize the script required a new release. https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.7.0.1


## Comment by @ascrivener

various performance optimizations: https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.7.0.2


## Comment by @ascrivener

more optimization: https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.7.0.4


## Comment by @ascrivener

applied https://github.com/davxy/jam-conformance/discussions/64 to latest release, all tests pass now


## Comment by @ascrivener

latest release clears newest trace batch. I guess I will start just updating latest release silently from here on? lmk if that's ok


## Comment by @ascrivener

fuzzer v1 + more optimizations in latest release


## Comment by @davxy

@ascrivener 

```
2025/09/15 16:12:19 JAM Fuzzer Interface Server
2025/09/15 16:12:19 Socket path: /tmp/jam_target.sock
2025/09/15 16:12:19 Fuzzer interface listening on /tmp/jam_target.sock
2025/09/15 16:12:24 New fuzzer connection accepted
2025/09/15 16:12:24 Handshake received from fuzzer: fuzzer (App v0.7.0, JAM v0.1.25)
2025/09/15 16:12:24 Error handling message data: failed to deserialize field Extrinsics: failed to deserialize field Guarantees: failed todeserialize element 39: failed to deserialize field WorkReport: failed to deserialize field WorkDigests: failed to deserialize element 373: failed to deserialize field ActualRefinementGasUsed: failed to decode GenericNum length
2025/09/15 16:12:24 Failed to start server: failed to deserialize field Extrinsics: failed to deserialize field Guarantees: failed to deserialize element 39: failed to deserialize field WorkReport: failed to deserialize field WorkDigests: failed to deserialize element 373: failed to des
```

This is when I send the `Initialize` message 


## Comment by @ascrivener

should be fixed in latest release


## Comment by @davxy

Yes I confirm that is fixed. Unfortunately now Jamzilla terminates after each session.
Can you keep listening for new connections instead? I need process several traces with my scripts


## Comment by @ascrivener

Latest release should continuously listen for new connections and also handle them in parallel if needed

But parallel might not work under some circumstances since right now the goroutines would all share the same database at least as of now


## Comment by @ascrivener

jamzilla should be clear for all traces now (not yet minifuzzed), but I see in the README that it's failing a bunch. can you confirm that it's still failing these on your side?


## Comment by @ascrivener

jamzilla should now be minifuzz conformant as well

EDIT: actually got an error on /faulty, fixing now


## Comment by @davxy

> EDIT: actually got an error on /faulty, fixing now

https://github.com/davxy/jam-conformance/tree/main/fuzz-proto/examples/v1#warning-faulty-session


## Comment by @ascrivener

yes thanks just saw that. We're all set then


## Comment by @ascrivener

<img width="179" height="28" alt="Image" src="https://github.com/user-attachments/assets/d9b15e99-f29b-459c-9a21-2006b8cf153c" />

This appears in version 0.7.0 of the graypaper in (12.17) and seems to be the root of all of jamzilla's diffs. It also seems buggy: The designate service is the service designated BY the service designated by the manager? I noticed it's changed in 0.7.1, although implementing that does solve most remaining issues, it doesn't fix all of them. So I'm just going to leave it for now until 0.7.1 tests are released, and if after implementing 0.7.1, I still have diffs related to this, i'll raise the issue again


## Comment by @ascrivener

https://github.com/ascrivener/jamzilla-conformance-releases/releases/tag/v0.7.1.0

now  at 0.7.1 + all jam conformance tests passing


## Comment by @ascrivener

fuzzy and fuzzy_light also pass now in the latest release


## Comment by @ascrivener

now on 0.7.2


## Comment by @ascrivener

there should be a decent improvement (20%?) on pvm speed in latest release, curious how it performs on the conformance dashboard. Is that dashboard fairly up to date?


## Comment by @ascrivener

https://github.com/davxy/jam-conformance/pull/152/ FYI


## Comment by @ascrivener

https://github.com/ascrivener/jam/releases/tag/v0.7.2.6 just made some pretty significant perf improvements in this one


## Comment by @davxy

@ascrivener your jam repo is not reachable to fetch the release. Please check the targets.json if you need to change the url


## Comment by @ascrivener

Should be fixed now, thanks for that 
