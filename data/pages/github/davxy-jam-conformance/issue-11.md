---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/11'
title: JamDuna
site: github.com/davxy/jam-conformance
created_at: '2025-08-07T21:03:32.000Z'
last_modified: '2025-08-07T21:03:32.000Z'
content_kind: issue
---

# JamDuna

## Issue by @mkchungs

Hello @davxy ,

Here's the repo to our [jamduna_target binary release](https://github.com/jam-duna/jamtestnet/releases). 

Can you run the fuzzer against our v0.6.7 binary? Thanks




## Comment by @davxy

I tested your binary, but unfortunately it fails on the second block import due to a **state root mismatch**.

What’s particularly odd is that when the fuzzer sends a `GetState` message at the end, the returned `State` message contains **none of the expected values**. As a result, a proper diff can't be constructed.

You can find the detailed report here: https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/jam-duna-target-v0.5-0.6.7_gp-0.6.7/report.json

For easier reproduction, I’ve also included the execution trace:  https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/traces



## Comment by @mkchungs

~~@davxy can you provide the error code for [00000002.json](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/jam-duna-target-v0.5-0.6.7_gp-0.6.7/00000002.json)?~~

~~The state root mismatch appears to be caused by the fact that we considered 00000002.json a valid transition, while the fuzzer seems to treat it as invalid~~

~~It seems like [00000002.json](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/jam-duna-target-v0.5-0.6.7_gp-0.6.7/00000002.json) does NOT involve any extrinsics.~~ ~~Given `stf.pre_state.stateroot` and `stf.post_state.stateroot` are
`0xf48ceafee3bba5fe51bc0ccbeb903df3070db2f476421b83aa93f419fc99721e`, I assume your fuzzer has "fuzzed" the block somehow but the fuzzed output still looks valid to me?~~

@davxy - thanks for the [note](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/NOTES.md). I have updated the jamduna_target to[ v0.6.7(0.7)](https://drive.google.com/file/d/1cvBldqWFOvI12l-vg6d16A2RL_j14ldw/view?usp=sharing) that should solve the error of:
```
2025/08/08 18:53:02 Received ImportBlock request for block hash: 0x05bd68bbc560ed2edef8b98381d3ca5f55741e7cf16430683e59847d1819f86d
2025/08/08 18:53:02 Error applying state transition from block: ParentStateRoot does not match
```

Can you please fuzz again?


## Comment by @davxy

New report here: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115


## Comment by @clearloop

> New report here: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115

we can not pass the two tests in this link as well (we can pass all traces for 0.6.7)

- `03` -> `BadSignature`
- `04` -> `CoreNotEnaged` (host call new got called which is not covered in the traces yet xd )


## Comment by @davxy

> > New report here: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115
> 
> we can not pass the two tests in this link as well (we can pass all traces for 0.6.7)
> 
>     * `03` -> `BadSignature`
> 
>     * `04` -> `CoreNotEnaged` (host call new got called which is not covered in the traces yet xd )

To be fair, they are passing 03.  
However, they are failing 04 (at least according to the fuzzer’s expectations)L
(The report usually includes the step that fails the expectation - in this case, 04 - along with the preceding step.)

 If you compare the prior and posterior roots for 04 (which is expected to fail import), you’ll see that the posterior root is expected to match the prior one: 
`0xa5d62b970119ed3c830f5a8786ef48259917a71dec11e5765fa710c5b71fa73f`.

Do you have a fuzzer target for your implementation? (SpaceJam right?)
If so, please open an issue like the other teams.



## Comment by @mkchungs

Thanks for the hint. We are now looking at the transition and see how we failed the conformance test.

Also the `bad_code` in https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/00000004.json#L165

should probably be `bad-code` according to https://github.com/w3f/jamtestvectors/blob/3a2d4a208c530ed848c4bba18e68e6fbf5595870/lib/jam-types.asn#L311, right ?


## Comment by @mkchungs

@davxy  I’m still not sure how to interpret the report in relation to the statetransition file.

For example, pre_state in 04 is: 
https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/00000004.json#L2-L3

And post_state in 04 is:
https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/00000004.json#L240-L241

Is pre_state.state_root  =  post_state.state_root "**INDICATING**" that the block is "**fuzzed**" and the your fuzzer is **expecting** the target to return  pre_state.state_root given the block?

https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/00000004.json#L111-L239
 
Also where is this expected root (`0xa5d62b970119ed3c830f5a8786ef48259917a71dec11e5765fa710c5b71fa73f `) coming from ?
https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/report.json#L31-L44



Here's my interpretations of the report:
* (a) Valid block: The block in 00000004.json is **Valid**:https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/00000004.json#L111-L239 

* (b) Expected root: this "unfuzzed/valid" block should yield post_state_root of `0xa5d62b970119ed3c830f5a8786ef48259917a71dec11e5765fa710c5b71fa73f`

* (c) Mismatch: The only mismatch is on key `0xfffc007b009a00380000000000000000000000000000000000000000000000 ` https://github.com/davxy/jam-conformance/blob/97d83a1fc5199a21f4e76b8b0538490ed5af5e59/fuzz-reports/jamduna/jam-duna-target-v0.7-0.6.7_gp-0.6.7/1754724115/report.json#L35-L44

* (d) Observed data: The post_state in 00000004.json contains the key–value pairs observed from the target (jam-duna-target-v0.7-0.6.7 in this case)


Is my understanding correct? If yes, I have fixed and rebuilt our target in[ jam-duna-target-v0.8-0.6.7](https://drive.google.com/file/d/1XA0XrEFTOUpUyZ23pgkmEw_Kvd9w4Rp9/view?usp=sharing) that now passes the "unfuzzed" [00000004_mod.json](https://github.com/user-attachments/files/21725077/00000004_mod.json) 





## Comment by @davxy

The fuzzer had a bug where it wasn’t setting the correct root and values in the posterior state of the traces.  

I fixed the issue and generated a new report for analysis:
https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.8-0.6.7_gp-0.6.7/1754982630



## Comment by @sourabhniyogi

@davxy We have a new fuzzer target
https://github.com/jam-duna/jamduna-target-releases/releases/tag/v0.6.7.9
which addresses some issues we found with other teams state transitions.  

But for your new report on own latest issue, we can't figure out what causes accumulation gas to be 0 for you (we ended up with 8764) in the 49652931 service:
```
-      "accumulate_gas_used": 0,
+      "accumulate_gas_used": 8674,
```
Everything else matches but this.   We went down a path thinking "failed deblob" related but ruled that out.  Can you advise please?




## Comment by @davxy

Due to some earlier call to `upgrade` for service 0x02f5a4c3 (perhaps not visible in the 2 traces I shared), it prepared for ejection (with the ejector set to service=0). Which ended up setting its code hash to 0x0000.0000 (I thing you can see it by loading the service account).  
Later, when we attempt to accumulate a work item for service id=0x02f5a4c3, its hash code is 0x0000...0000, which causes the lookup to fail.



## Comment by @sourabhniyogi

> Due to some earlier call to `upgrade` for service 0x02f5a4c3 (perhaps not visible in the 2 traces I shared), it prepared for ejection (with the ejector set to service=0). Which ended up setting its code hash to 0x0000.0000 (I thing you can see it by loading the service account). Later, when we attempt to accumulate a work item for service id=0x02f5a4c3, its hash code is 0x0000...0000, which causes the lookup to fail.

Thank you for this advice (our mistake was to use the code hash from the work report instead of the service object).  Here is our newest fuzzer target binary:
 https://github.com/jam-duna/jamduna-target-releases/releases/tag/v0.6.7.10



## Comment by @davxy

report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.8-0.6.7_gp-0.6.7/1755105426

It seems you might be missing an assurance threshold check before running a report on a core, or something like that


## Comment by @mkchungs

@davxy  We lowered assurance threshold to test against 4 + 2 jamduna + polkajam for running a multi-client testing in tiny mode.  

We have reverted such change and republished the target binary to [v0.6.7.11](https://github.com/jam-duna/jamduna-target-releases/releases/tag/v0.6.7.11) according to GP [here](https://graypaper.fluffylabs.dev/#/7e6ff6a/149700149700?v=0.6.7)

Thanks again for hint. Will be great if you can re-run the test report?



## Comment by @sourabhniyogi

Latest fuzz target is [v0.6.7.13](https://github.com/jam-duna/jamduna-target-releases/releases/tag/v0.6.7.13) -- we found a similar ">= should be >" issue concerning Stale Work reports [here](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamzilla/jam-node-0.1.0_gp-0.6.7/1755082451/00000011.json).  

These tests are super pro grade and have revealed many nooks and crannies we forgot we had!  We put as many of the jam-conformance "failures" into one place [here](https://github.com/jam-duna/jamtestnet/tree/main/0.6.7/jam-conformance), so we can test against these as well as the 0.6.7 traces as we purport to have a fix.  This way we can say "our fuzzer target passes 0.6.7 traces as well as everything in this directory" instead of discovering our fuzzer target fails on something other teams have gotten stuck on. 



## Comment by @davxy

A couple of new reports: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.13-0.6.7_gp-0.6.7


## Comment by @sourabhniyogi

> A couple of new reports: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.13-0.6.7_gp-0.6.7

Latest fuzzer target is [v0.6.7.14](https://github.com/jam-duna/jamtestnet/releases/tag/v0.6.7.14) as well as a fuzzer binary.   We added the ability to get PVM traces out of the fuzzer target using our fuzzer binary (or yours).   Does `polkajam` have a fuzzer target that we can test our fuzzer on?



## Comment by @sourabhniyogi

Alright @davxy we fixed the B.10 (new service calculation) + reverted the bless/designate "solution" as well as added a TicketsMark attempt check in [v0.6.7.16](https://github.com/jam-duna/jamtestnet/releases/tag/v0.6.7.16) -- 

However, for test [1755248769](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/0.6.7/1755248769/00000015.json) there is a invalid assurance, which by this:

<img width="382" height="35" alt="Image" src="https://github.com/user-attachments/assets/f1981def-e1c6-4dc5-83ec-be7b1926b9bb" />

after closer inspection, the correct solution is to consider the whole block invalid because of a single invalid component of the extrinsic.   Do you agree?   

Would be good to see the B.10 fix in 0.6.7 traces and in polkajam soon


## Comment by @davxy

> However, for test [1755248769](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/0.6.7/1755248769/00000015.json) there is a invalid assurance, which by this:

From what I can tell there are no invalid signatures. Which one is invalid?

> Would be good to see the B.10 fix in 0.6.7 traces and in polkajam soon

WDYM?


## Comment by @sourabhniyogi

> > However, for test [1755248769](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/0.6.7/1755248769/00000015.json) there is a invalid assurance, which by this:
> 
> From what I can tell there are no invalid signatures. Which one is invalid?
> 

I am sorry for not providing sufficient detail earlier.   (I assumed, incorrectly, you have hand crafted these fuzz processes and know what 1755248769 is intended to do [EpochMark testing].)

We think this assurance has an invalid signature:

https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.6.7/traces/1755248769/00000015.json#L138-L143

```
{
  "anchor": "0x9ec8f8cb1ce9be3c671b013f406faa49af4dd6da54b30efd8beef67e12791156",
  "bitfield": "0x01",
  "validator_index": 0,
  "signature": "0x33a89a4a3f2de9421e15cfc16b7737537b98cc9c22208ffcd6568f199a1d7c0a79b53fc115681c45df8b22264472531b711a10492de75cbf1266e1c87816590c"
}
```

where the signature checking process we have is:

```
Assurance UnsignedBytes: 9ec8f8cb1ce9be3c671b013f406faa49af4dd6da54b30efd8beef67e1279115601
Assurance H(UnsignedBytes): c8e93c35f6c29ca6fa221b10a6517d2db875d9556676b2d1073f08abda0cb846
Assurance VerifySignature Failed: 
SignText 6a616d5f617661696c61626c65c8e93c35f6c29ca6fa221b10a6517d2db875d9556676b2d1073f08abda0cb846
```

We are checking with pre-state (kappa) **Validator 0** info:
```
{"bandersnatch":"0x0746846d17469fb2f95ef365efcab9f4e22fa1feb53111c995376be8019981cc",
"ed25519":"0xf30aa5444688b3cab47697b37d5cac5707bb3289e986b19b17db437206931a8d",...}
```

Critically, validator 0 is changing -- see [EpochMark](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.6.7/traces/1755248769/00000015.json#L97) -- ala [6.13](https://graypaper.fluffylabs.dev/#/9a08063/0e4c000e4c00?v=0.6.7) is changing validators. 

<img width="485" height="70" alt="Image" src="https://github.com/user-attachments/assets/bcc148e2-914b-4ebf-ac62-29f8b93f6dbf" />

But by [11.13](https://graypaper.fluffylabs.dev/#/9a08063/14f20014f200?v=0.6.7)

<img width="490" height="41" alt="Image" src="https://github.com/user-attachments/assets/6e090294-f157-4ee8-8f8c-9c90f240fa5a" />

the validation of assurances signatures should use kappa (pre-state, from e), not kappa' (post-state, from e').  

... Or, we have a misunderstanding here.  Did we get this concept wrong?

If we skip our validation of the signature for this test, we match state roots, but that would not be correct, we'd fail some other fuzz which bitflipped the signature.  

Update: we checked with others and Jamzilla reported his kappa so we probably got our decoded screwed up somewhere.  So, disregard for now, thank you!

> > Would be good to see the B.10 fix in 0.6.7 traces and in polkajam soon
> 
> WDYM?

For testing multiclient `polkajam` + `jamduna` testnets (e.g. 5 `polkajam` + 1 `jamduna`), we test work package submission with the bootstrap services which definitely has a "new".  Our workaround is to put our all our services in genesis.  We're unclear if a fix in the fuzzer (e.g. for B.10) implies a fix in `polkajam` within a day or two.   

If there are no "new" host function invocations in the 0.6.7 traces, then disregard that part.


## Comment by @davxy

> We are checking with pre-state (kappa) Validator 0 info:

> {"bandersnatch":"0x0746846d17469fb2f95ef365efcab9f4e22fa1feb53111c995376be8019981cc",
> "ed25519":"0xf30aa5444688b3cab47697b37d5cac5707bb3289e986b19b17db437206931a8d",...}

From what I can tell `f30a...` is the post-state (kappa') validator 0 info.
The prior state active validator 0 key is : `4418fb8c85bb3985394a8c2756d3643457ce614546202a2f50b093d762499ace`


## Comment by @yoyo2325

hi @davxy I have a question related to [this traces](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.6.7/traces/1755530535/00000011.bin)

here is what we encountered
```
INFO [08-18|11:14:54.095] "HOSTLOG-\x00\x11jam-fuzzy-service\x060.1.24\nApache-2.0\x01%Parity Technologies <admin@parity.io>" msg="Selected instruction: RandomJump"
INFO [08-18|11:14:54.097] "HOSTLOG-\x00\x11jam-fuzzy-service\x060.1.24\nApache-2.0\x01%Parity Technologies <admin@parity.io>" msg="Random jump to @ a0ea78ab"
```
then we got
```
WARN [08-18|11:14:54.097] Jump address out of bounds               service="\x00\x11jam-fuzzy-service\x060.1.24\nApache-2.0\x01%Parity Technologies <admin@parity.io>" mode=accumulate pc=6367 jump_address=2,699,720,875 max_address=1100
```

according to the GP [here](https://graypaper.fluffylabs.dev/#/38c4e62/264600264e00?v=0.7.0), if the jump_target is larger than the jump table length, it should result in a panic

Can you give us any advice? 


## Comment by @sourabhniyogi

We published our [0.6.7.17](https://github.com/jam-duna/jamtestnet/releases/tag/v0.6.7.17) with fixes for 1755248769.   


1. Concerning these 7 cases, they only differ in statistics, where polkajam has 0 gas and we have non-zero accumulated gas:
* 1755530535/00000011.bin //  0 polkajam, 22717 jamduna
* 1755531000/00000008.bin // 0 polkajam, 22907 jamduna
* 1755531229/00000035.bin // 0 polkajam, 19087 jamduna
* 1755531322/00000008.bin // 0 polkajam, 14562 jamduna
* 1755531375/00000008.bin // 0 polkajam, 16045 jamduna
* 1755531419/00000008.bin // 0 polkajam,  15964 jamduna
* 1755531480/00000008.bin // 0 polkajam, 52349 jamduna
We could not find a reason (bad-code related, A.38 or A.41 or deblobing related) why polkajam would end up with 0 accumulation gas. Our understanding is that even if there is an improper read/write access causing a panic, it would not be cause for 0 accumulation gas on the return [here](https://graypaper.fluffylabs.dev/#/7e6ff6a/2d46032d4603?v=0.6.7).  So we concur with Jamzilla and JavaJAM that this is likely a fuzzer side issue.  Or we need a hint on what causes the 0...

2. These 3, we believe, are explainable with the realization that polkajam and us have both  recompiler vs interpreter backends with different gas accounting combined with a `gas` call that writes the result into a storage location.  This summer we switched our interpreter to using charging gas per basic block so that we could get the recompiler and interpreter get the same gas (in both work reports in refine as well as accumulate), and after switching back to "one-by-one" our accumulate gas matches not polkajam but other teams.  
* 1755531081/00000008.bin // 1-byte level difference in the storage location
* 1755531179/00000008.bin // 1-byte level difference in the storage location
* 1755530728/00000008.bin // 13063 polkajam, 13048 jamduna  

We fixed a "low memory" problem with the third case ( 1755530728 ), then got the gas to match perfectly doing basic block accounting (13063), but then we decided to do interpreter "one-by-one" for now in expectation that teams are not ready to go all in.  You could just force all implementers into the "recompiler" based model in 0.6.7, or take out the "gas" call from these tests.  

3. These cases might be like (2) or might not, we still need to investigate further:
* 1755531265/00000008.bin // 8 byte difference 0xFFFF...FFFF
* 1755530896/00000008.bin // polkajam 12667, jamduna 23512, many differences



## Comment by @sourabhniyogi

@davxy We have addressed 2 outstanding issues in our [0.6.7.18](https://github.com/jam-duna/jamtestnet/releases/tag/v0.6.7.18) for the 3 traces:
* 1755531265 
* 1755530896 + 1755620371 
We added some outstanding checking memory writes and appropriate blocks on fetch

However, for the new 1755621252 (a "checkpoint" test), we believe the fuzzer isn't actually checkpointing the written value `0x0436980000000000` for the state key `0x628b2afee748be0d75a39350dba161af70e6468719f1ae681fcb0c24988aa0` after hitting an exception.


## Comment by @davxy

1755621252 was included by mistake. Please ignore it. It is not in the table ans there should be no team report for it (if yes, ignore it) 


## Comment by @sourabhniyogi

Updated our fuzzer target to [v0.6.7.19](https://github.com/jam-duna/jamtestnet/releases/tag/v0.6.7.19) with our fix to 1755796995 (recent accumulation update placement).  Looking forward to 0.7.0 traces + fuzzing!


## Comment by @sourabhniyogi

@davxy We have passed the codec + stf 0.7.0 vectors and completed various renames we wanted to do for a while now.  If we're done with 0.6.7 (us individually or as a group), and you have 0.7.0 traces in preview form for us to QA, then, immediately after passing them in the next couple of days (should be easy, esp if you're not doing anything new beyond the codec changes), we can proceed to post a 0.7.0.0 fuzzer target for your fuzzer to checkout, if thats useful.  



## Comment by @sourabhniyogi

@davxy We are ready for our first 0.7.0 fuzz report.

https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.0


## Comment by @sourabhniyogi

@davxy We are definitely ready for our first 0.7.0 fuzz report having passed the traces (including 00000008)

Latest is at:
https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.1


## Comment by @davxy

Your target returns 0.6.7 in the `PeerInfo` message


## Comment by @sourabhniyogi

> Your target returns 0.6.7 in the `PeerInfo` message

Please accept my apologies -- updated JamVersion to `fuzz.Version{Major: 0, Minor: 7, Patch: 0}` 

https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.2


## Comment by @sourabhniyogi

@davxy We have a new fuzz target [v0.7.0.3](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.3) that aims to improve our overall latency!

Thank you for turbocharging us into doing this!


## Comment by @sourabhniyogi

@davxy We have a new fuzz target https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.4 that fixed 4/5 of the failures as well as attempts to see if we did better on perf.  


## Comment by @sourabhniyogi

@davxy We have a new fuzz target https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.5 that fixed 5/5 of the failures as well as attempts to see if we did better on perf.


## Comment by @sourabhniyogi

<img width="354" height="508" alt="Image" src="https://github.com/user-attachments/assets/47a6e84d-7f26-4c6e-bb37-37ba767cea9b" />

Motivated by the "Audit Time Calculator" in the gorgeous [JAM Conformance dashboard](https://paritytech.github.io/jam-conformance-dashboard/), we have a new fuzz target https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.7 that attempts to see how much better we can do with 2-3 days of optimization work and also addresses an SBRK fix.


## Comment by @sourabhniyogi

@davxy https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.8 has our fix for 1757062927 -- we hope we can see new `perf` reports from this weeks optimizations.  




## Comment by @sourabhniyogi

@davxy https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.9 has our fix for 1756548459 -- we needed a proper fix for SBRK heap expansion (and a mutex) amidst service accumulation parallelization.


## Comment by @mkchungs


@davxy [jamtestnet v0.7.0.10 release](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.10) — updated with the new release.

We’ve fixed all **5/5 trace cases** from the previous report and upgraded both the target and fuzzer to Fuzz-V1 with BlockAncestry and SimpleForking support

```
./duna_fuzzer_mac --version
Fuzzer Info:
  Name: jam-duna-fuzzer
  FuzzVersion: 1
  AppVersion: 0.2.10
  JAMVersion: 0.7.0
  Features: BlockAncestry=true, SimpleForking=true, BundleRefinement=false, Export=false, Extension=false

./duna_target_mac --version
Target Info:
  Name: jam-duna-target
  FuzzVersion: 1
  AppVersion: 0.2.10
  JAMVersion: 0.7.0
  Features: BlockAncestry=true, SimpleForking=true, BundleRefinement=false, Export=false, Extension=false
```

BlockAncestry hasn’t been robustly tested against external fuzzer yet, so we look forward to your ancestry test case once it’s available.



## Comment by @mkchungs

@davxy - 
Updated to https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.11. We  have updated out fuzzer & target binary to support the new Error format with string + properly handle the fork logic.

We also tested & replayed the v1 against our target -- currently failing on step 25 & step 29 -- which we will address next. 





## Comment by @davxy

@mkchungs 
In the PeerInfo message the `jam-version` should be encoded before `app-version`.
Apparently you inverted these fields


## Comment by @davxy

(Using minifuzz: https://github.com/davxy/jam-conformance/pull/85)

```
❯ ./minifuzz.py -d ../examples/v1/
Found 31 fuzzer files to process
Connected to target socket: /tmp/jam_target.sock

==========================================================================
Processing pair 1: 00000000_fuzzer_peer_info.bin -> 00000000_target_peer_info.bin
TX: peer_info
RX: peer_info
Unexpected JAM protocol version. Expected: {'major': 0, 'minor': 7, 'patch': 0}, Got: {'major': 0, 'minor': 2, 'patch': 11}
Connection closed
```


## Comment by @mkchungs

@davxy –  
Updated to [v0.7.0.12](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.12). We fixed all **6/6 traces** from the last batch and updated `PeerInfo` to match the latest **Proto-V1**.

For **minifuzz**, I believe we’ve passed the `example/v1` tests ([logs here](https://gist.github.com/mkchungs/b38e4e024c0b70ccee0a4a3a70d2d566)). Please let me know if I missed anything.

Regarding **BlockAncestry** (which we have currently disabled), I believe the current STF/traces need to be augmented to include `AncestryItems`; otherwise, we lose random-access capability when testing state transitions with `{N-1, N}` STF. What do you think?


## Comment by @davxy

Yes, traces and stf will be update to include ancestry. Perhaps from 0.7.1. Right now my agenda is quite packed :-)


## Comment by @sourabhniyogi

@davxy -- updated to [v0.7.0.13](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.0.13) -- 

We addressed _most_ of the issues in the last 0.7.0 batch, but not all (1758621171, 1758622403, 1758622442, 1758708840 remain) -- based on your "Keep in mind that it is not mandatory to pass every case." we hope we can carry over these and solve them in our 0.7.1 fuzzer target, which we'll have next week.  Thank you!






## Comment by @sourabhniyogi

@davxy -- updated to [v0.7.1.1](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.1.1) -- look forward to the first reports, maybe with the above


## Comment by @yoyo2325

hello @davxy 
now we supported both recompiler mode (also passed the fuzzy traces) and interpreter mode in [0.7.1.3]( https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.1.3) 
```
Target:
./duna_target_linux (interpreter - default)
./duna_target_linux_compiler (recompiler backend)
```


## Comment by @sourabhniyogi

@davxy We finally got through 0.7.1 fuzzy traces + jam-conformance  and published a [0.7.1.4](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.1.4) 

```
./duna_target_linux (interpreter - default)
./duna_target_linux_compiler (recompiler backend)
```

If the `duna_target_linux` is passing then could we get a second entry for `duna_target_linux_compiler`?  

We removed many parallelization optimizations and expect to be slower latency wise on both, but expect we can put it back after both are passing jam-conformance.




## Comment by @mkchungs

@davxy -  We have updated to [0.7.1.5](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.1.5) with compiler backend. -- Interpreter backend is now **removed**.

This release is now passing all traces on `fuzzy-round` and `davxy/fuzz-round-2` branch 


## Comment by @davxy

```
❯ ./target.py run jamduna
Action: run, Target: jamduna, OS: linux
Running jamduna on docker image
Command: ./duna_target_linux --socket /tmp/jam_target.sock
Image: debian:stable-slim
Image ID: 7097a459326f
Created: 2025-08-11T00:00:00Z
Ensuring no leftover container with name jamduna...
Waiting for target termination (pid=191850)
panic: JAM_PATH environment variable is not set

goroutine 1 [running]:
github.com/colorfulnotion/jam/common.GetFilePath({0xaf4d27, 0x2d})
        /Users/michael/Github/jam/common/tool.go:292 +0x87
github.com/colorfulnotion/jam/statedb.init()
        /Users/michael/Github/jam/statedb/rollup.go:29 +0x2d
Target process exited with status: 2
Cleaning up Docker container jamduna...
```


## Comment by @mkchungs

Hi @davxy - We have fixed and republished [0.7.1.6](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.1.6). Thank you!


## Comment by @sourabhniyogi

@davxy Are you still having Docker issues with 0.7.16?


## Comment by @davxy

@sourabhniyogi no issues


## Comment by @sourabhniyogi

We passed all 0.7.2 traces and have published [0.7.2.0](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.0)


## Comment by @mkchungs

@davxy. Happy Xmas!

We have published [0.7.2.2](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.2) that is now passing all traces from the christmas batch  


## Comment by @mkchungs

~Hi @davxy,~

~We have published [0.7.2.3](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.3) to address the same "`ParentHeaderHash does not match recent block` errors" that we saw in multiple reports.~

~However, Im unable to reproduce  the "[IO error: early eof (potential target crash)](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.2/reports/jamduna/1766244251_1244/report.json#L60)"~

~Can you kindly rerun the test with 0.7.2.3 or show us a bit more logs that lead to this error?~



## Comment by @mkchungs

@davxy 

We have updated to ~0.7.2.4~ [0.7.2.5](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.5) to properly handle the "fork" issue found in [last report](https://github.com/davxy/jam-conformance/blob/b5e16820559948889214bd5d6ae9d191c83e472d/fuzz-reports/0.7.2/summaries/summary_jamduna.txt) & with new logic to improve compiler performance.  thanks!


## Comment by @mkchungs

@davxy 

We have updated to [0.7.2.6](https://github.com/jam-duna/jamtestnet/releases/tag/v0.7.2.6) which is now passing NYB
