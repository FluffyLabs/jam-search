---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/4'
title: JamZig⚡
site: github.com/davxy/jam-conformance
created_at: '2025-07-30T22:27:04.000Z'
last_modified: '2025-07-30T22:27:04.000Z'
---

# JamZig⚡

## Issue by @boymaas

Good evening @davxy,

Thank you for running the fuzzer against JamZig target. I noticed a minor issue in the guarantee core assignment validation. I have just pushed a new version that should pass blocks 3 and 4. I look forward to the next results.

https://github.com/jamzig/conformance-releases

Cheers,  
Boy Maas


## Comment by @davxy

Hey! 1753809875 is fixed now.
I provided you another: 1753948715


## Comment by @boymaas

Thank you once again, @davxy. I have fixed blocks 14 and 15 and am now uploading a new version of the target. I look forward to the next one 🤠


## Comment by @davxy

Curious: what was the issue?

Do you have a target for version 0.6.7? I'm currently shifting my focus to that protocol revision.
We also published collecting feedback about test vectors https://github.com/davxy/jam-test-vectors/pull/87


## Comment by @boymaas

As always, a small detail, @davxy: in the load preimage host call, when supplied with a length of 0, it should not try to read anything but simply return the length. I will prepare a target for version 0.6.7, upload it, and inform you here. Thank you for the link to the new test vectors.


## Comment by @boymaas

Ready for some more v0.6.7 fuzzing action! https://github.com/jamzig/conformance-releases.  Im am in the middle of some mayor refactoring of the codebase / host call functions 🤞


## Comment by @davxy

new report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzig/jamzig-target-0.1.0_gp-0.6.7/1754753264


## Comment by @boymaas

Thanks @davxy, running into a designate issue with this trace. I have a quick question. I noticed that the post_state root of block 1 in the report does not match the pre_state root of block 2. Is this intentional? 

Block 1
```
    "post_state": {
        "state_root": "0x81570b94123c90619fd968ee7aea10d5dd82ea4df89a1d5f9cac22c63700c89a",
```

Block 2
```
  {
    "pre_state": {
        "state_root": "0x4be5021a68975bf5d4a67090f65c542503b91f9ea7e998b72a8b49d0c471c034",
```


## Comment by @davxy

> I noticed that the post_state root of block 1 in the report does not match the pre_state root of block 2. Is this intentional?

interesting. Smells like a bug in the fuzzer. I'll have a look


## Comment by @davxy

Fixed 1754753264 report


## Comment by @boymaas

Thanks for the fix @davxy. This error occurred while I was refactoring the host functions. After the refactoring, it works out of the box. I'm uploading a new version now:  https://github.com/jamzig/conformance-releases.


## Comment by @davxy

new report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzig/jamzig-target-0.1.0_gp-0.6.7/1754988078


## Comment by @boymaas

Thanks, @davxy. When I run the report, it executes the bless command, and my implementation checks for the existence of the target service to be blessed, which causes the failure. Disabling that check allows everything to pass. I have uploaded a new version without this check @ https://github.com/jamzig/conformance-releases and will explore the gray paper to determine if this check is necessary or if I added it myself.


## Comment by @davxy

@boymaas I think is the same issue reported to JavaJam [here](https://github.com/davxy/jam-conformance/issues/8#issuecomment-3164976981). Please have a look and eventually report your interpretation if differs from mine. Thank you


## Comment by @boymaas

@davxy , agreed—each parallel invocation gets a fresh context, merges changes, and reruns if gas remains. JamZig folllows the spec.

My mistake was checking service IDs in bless too thoroughly; graypaper only requires them to be in the u32 domain; otherwise, return WHO. Yesterday did a lot of refactorings. Uploaded a new version:  https://github.com/jamzig/conformance-releases


## Comment by @davxy

new report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzig/jamzig-target-0.1.0_gp-0.6.7/1755081941


## Comment by @boymaas

Thanks, @davxy. I see there is now a new trace ready. Now at block 24! 🤠 Will run it now to see whats happening.

I found something interesting at the previous fuzz report (3c53b60e3aae8b5285b6372cb7411b3ee4946462) @ https://github.com/davxy/jam-conformance/tree/3c53b60e3aae8b5285b6372cb7411b3ee4946462/fuzz-reports/jamzig/jamzig-target-0.1.0_gp-0.6.7/1755074576

In the previous one I noticed a difference in the statistics, where this is the only state variation:

<img width="433" height="479" alt="Image" src="https://github.com/user-attachments/assets/ac30b611-d3b4-4c98-90f7-450c01fe0ea3" />

where + indicates what the fuzzer expects and - indicates what I have. I count 3 assurances for core 1 and 2, while the fuzzer expects 0 assurances for core 1 and 2. When I examine the json for block 7, I see the following:

From block 7's assurances:

https://github.com/davxy/jam-conformance/blob/3c53b60e3aae8b5285b6372cb7411b3ee4946462/fuzz-reports/jamzig/jamzig-target-0.1.0_gp-0.6.7/1755074576/00000007.json#L124-L149

Essentially:

```
[
{ "bitfield": "0x02", "validator_index": 0 },  // Binary: 0010 →
core 1 only
{ "bitfield": "0x03", "validator_index": 1 },  // Binary: 0011 →
cores 0 and 1
{ "bitfield": "0x03", "validator_index": 2 },  // Binary: 0011 →
cores 0 and 1
{ "bitfield": "0x01", "validator_index": 3 }   // Binary: 0001 →
core 0 only
]
```

The bitfield is interpreted as:
- Bit 0 (LSB) = Core 0
- Bit 1 = Core 1
- etc.

Core 0 popularity calculation:
- Validator 1: bit 0 set (0x03 = 0011) ✓
- Validator 2: bit 0 set (0x03 = 0011) ✓
- Validator 3: bit 0 set (0x01 = 0001) ✓
- Total: 3 validators assuring core 0

Core 1 popularity calculation:
- Validator 0: bit 1 set (0x02 = 0010) ✓
- Validator 1: bit 1 set (0x03 = 0011) ✓
- Validator 2: bit 1 set (0x03 = 0011) ✓
- Total: 3 validators assuring core 1

I double-checked the gray paper, and I believe we should endup at a popularity of 3 on both cores. See: [https://graypaper.fluffylabs.dev/#/7e6ff6a/194f03196703?v=0.6.7](https://graypaper.fluffylabs.dev/#/7e6ff6a/194f03196703?v=0.6.7)


## Comment by @davxy

Yes, there was a bug in our implementation.  
That trace has been removed.

Note. All meaningful and resolved traces (inter-team) have been moved to the [archive](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/archive/0.6.7) folder, making it easier for the teams to cross-check each other reports.


## Comment by @boymaas

Perfect, thanks @davxy, that's good to know. In the meantime, I resolved the latest case. This was a simple SealVerification issue on my side. Uploaded a new version: https://github.com/jamzig/conformance-releases


## Comment by @davxy

new one: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamzig/1755185281


## Comment by @boymaas

This was an interesting case, @davxy. Thanks again! The trace jumped an epoch from the ticket submission window. The new version is available at: https://github.com/jamzig/conformance-releases.

The fuzzer implementation correctly switches to fallback key mode based on this equation: https://graypaper.fluffylabs.dev/#/7e6ff6a/0e85020e8802?v=0.6.7. Great fuzz!


## Comment by @boymaas

All archives are passing for JamZig⚡. 🤠  Except for 1754982087, which I am skipping due to incorrect ServiceID generation. I expect you will remove that one in the next update.


## Comment by @boymaas

New version is available at: https://github.com/jamzig/conformance-releases


## Comment by @boymaas

Goodmorning @davxy.

I am currently reviewing the traces and encountering the same issues as @jaymansfield in #8  [issue](https://github.com/davxy/jam-conformance/issues/8#issuecomment-3198244564) regarding the 0 gas, along with an additional delta. For example in **1755530728**. JamZig logs show the PVM code performing some storage host calls, then executing a **checkpoint**, followed by a **random jump** to an **invalid jump address** to trigger an exception. The **checkpoint** should have saved the state up to that point, so the state changes should be preserved up to the checkpoint according to JamZig's interpretation of the GP. So additionally to @jaymansfield issue, JamZig also notices a delta in the service (2494454674), which I believe should be there. This is something to check as well.



## Comment by @boymaas

Another add on the gas=0 from **1755531000** differ. If I trace the PVM execution correctly, this fuzz assumes that an invalid host call during accumulation should cause the run to fail. However, based on my reading of the gray paper, invalid or unknown host calls are meant to be handled gracefully with r7=WHAT, not fatally. This may occur in the fuzzer because no accumulate state changes are expected and gas is set to 0.

In JamZig, the we follow the spec: the PVM deducts 10 gas, sets R7 to WHAT, and continues execution. That’s why the accumulation completes normally (~22k gas used) and storage changes remains intact.


## Comment by @boymaas

**1755530300** Issue with JamZig⚡ – Yield host call outputs were stored during accumulation but never propagated to theta after a refactor. This change ensures outputs are collected, sorted by service ID, and written into theta. Test 1755530300 now passes.


## Comment by @davxy

See NEWS. I'll propose a new batch soon :-/ 


## Comment by @boymaas

Aaah, I see. No problem, @davxy. It's a good exercise to question any report instead of accepting it at face value. Graypaper is the source of truth. I fixed the 300 earlier; it was the only one on my end. I will upload the new version in 10 minutes. JamZig⚡ passes all traces now. Looking forward to the next batch! 🤠


## Comment by @boymaas

Hi @davxy, I've been analyzing the new TESTING/**1755530535** and I believe I found an issue with the fuzz trace's expectations regarding checkpoint behavior.

The PVM code in this test performs the following sequence at the end of the PVM trace:
1. Executes a storage write (host call 3) - writes key
0x92335b9dae8094e78aa3ff6314502ea9b00f400aaa0b0ece6204ec1211cbda
2. Calls checkpoint (host call 1) to save state
3. Then performs an invalid jump causing execution to fail, triggering the exceptional domain

The dispute:

- JamZig⚡ behavior: Preserves the storage write from step 1, as it was saved by the checkpoint in step 2
- Fuzz expectation: The storage write should not exist at all, it expects only 6 storage items instead of 7

Why I believe JamZig⚡ is correct:

According to the graypaper, checkpoint (host call 1) saves the state in the exceptional domain at that point. When execution later fails, we should revert to the last checkpoint state, which includes:
- All storage changes made before the checkpoint
- The storage write from step 1

The test incorrectly expects the write to be completely absent, as if checkpoint doesn't save prior service state changes. The evidence is clear in the state diff - the test expects the storage key 0x92335b... to not exist at all, despite it being written before the checkpoint.

Let me know if you need any clarification or if you'd like me to investigate further! There is also a large gas cost delta which I will look into after we clarified this. Maybe I am wrong on this point.



## Comment by @jaymansfield

> 0x92335b9dae8094e78aa3ff6314502ea9b00f400aaa0b0ece6204ec1211cbda

I just tried the trace and don't see that state key at all.

Mine results in the correct state root and I see 6 write host calls, and these are the keys manipulated in each:

0x926d5bb3ae3194cc92b710d90e1b0534eef6dc7d7bc6c44aafebf7212f7c7c
0x928e5b26ae4e948f29a461f8df4e2eb581d5d6416d011dd2ca3793fa4e263b
0x92225b8bae5394a31d9fe6cdba6da45e173695d99a7d8474aa8abfba21ca07
0x928e5b26ae4e948f29a461f8df4e2eb581d5d6416d011dd2ca3793fa4e263b
0x923c5badae8494782f063b00b211287f061ddecc58bc658d538809fbae8387
0x928e5b26ae4e948f29a461f8df4e2eb581d5d6416d011dd2ca3793fa4e263b

Hopefully that is helpful.



## Comment by @clearloop

I can reach this storage key as well 

```
  INFO program: hostcall: checkpoint(0) target="fuzzy"

     ...

     WARN stf:accumulate: Failed to read value bytes: Fault { page: 549715 }

    -> state after checkpoint 0 till here should get reverted
  
    DEBUG stf:accumulate: calling host call 100
     INFO program: Write res: 18446744073709551613 target="fuzzy"
    DEBUG stf:accumulate: calling host call 4
    DEBUG stf:accumulate: writing to account 2494454674, key: 0x92335b9dae8094e78aa3ff6314502ea9b00f400aaa0b0ece6204ec1211cbda

     ... no errors

     INFO program: hostcall: checkpoint(1) target="fuzzy"

     -> the key should be saved in checkpoint 1
```

the key written of `0x92335b9dae8094e78aa3ff6314502ea9b00f400aaa0b0ece6204ec1211cbda` performs after the page fault and before checkpoint 1, which should be stored but it got reverted in the expected result of the trace


## Comment by @boymaas

Thank you @jaymansfield  and @clearloop.

@clearloop Is your exit from the accumulation due to a page fault, as indicated by your log extraction?

```
WARN stf:accumulate: Failed to read value bytes: Fault { page: 549715 }
```

My accumulation ends in an exception due to an invalid jump address from a RandomJump, following the last debug log stating:

```
fuzzy: Random jump to @ a0ea78ab
```



## Comment by @clearloop

> [@clearloop](https://github.com/clearloop) Is your exit from the accumulation due to a page fault, as indicated by your log extraction?
>
> ...
>
> My accumulation ends in an exception due to an invalid jump address from a RandomJump, following the last debug log stating:
> 
> ```
> fuzzy: Random jump to @ a0ea78ab
> ```

exactly the same

```
     INFO program: Random jump to @ a0ea78ab target="fuzzy"
    ERROR stf:accumulate: invalid dynamic jump, address: 2699720875, table len: 550
     WARN stf:accumulate: PVM execution stopped with reason: Panic("invalid dynamic jump") for service 2494454674
```

our state root is `0xc8c4827bd556745ca89a58a8f326a3d37e74bd164c7a38b078b3d195d9a17327`, not sure if we can get matched 😉

also, I found that the checkpoint log from the program does not emit right before the checkpoint operation, the page fault actually affect on nothing, if the the program logic is correct, there might be sort of branch issues in the translation between riscv and pvm at specific syntax

for more details, we got *service data* mismatched in 

| symbol | key | polkajam | spacejam |
| - | - | - | - |
| `a` | `0x923c5badae8494782f063b00b211287f061ddecc58bc658d538809fbae8387` | `0x00` | `0x03` |
| `b` | `0x928e5b26ae4e948f29a461f8df4e2eb581d5d6416d011dd2ca3793fa4e263b` | `0x03...` | `0x04...` |

for the life cycle of the two in the provided PVM bytecode

| checkpoint | `a` | `b` |
| - | - | - |
| 0 | `0x00` |  `0x03...` |
| Page Fault | `0x00` | `0x03...` |
| 1 | `0x01` | `0x04...` |
| 2 | `0x02` | `0x04...` |
| 3 | `0x03` | `0x04...` |
| invalid djump | - | - |

anyway, looks like the trace expected us exit at the `Page Fault` but not continue the execution however at `B.13`, the GP just says we should exit at `halt` or `panic`




## Comment by @davxy

I don't see any write for key, `0x92335b9dae8094e78aa3ff6314502ea9b00f400aaa0b0ece6204ec1211cbda`.
To be clear, @boymaas  you are referring to `00000011.bin` right? (not `00000010.bin`)


## Comment by @boymaas

@clearloop Yes, I reach the same root as you:
`0xc8c4827bd556745ca89a58a8f326a3d37e74bd164c7a38b078b3d195d9a17327` 🤞

@davxy I’m indeed referring to importing the trace file 00000011.bin.

I traced the issue back to the message in @clearloop’s log output. It suggests that a storage write is attempting to read from invalid memory, leading to (in my case) an out-of-bounds (OOB) error. The difference is in how implementations handle it: the fuzzer (and likely @jaymansfield) hard-panics, halting execution—this explains the large gas-consumption delta at the end. Meanwhile, @clearloop and JamZig⚡ treat it as OOB and continue execution.

Looking at the graypaper: for regular host functions, a page fault should trigger a panic, not return OOB. OOB is only meant for memory access failures inside a nested PVM instance—if I’m interpreting it correctly. That would mean the fuzzer and @jaymansfield’s approach is the correct one.



## Comment by @boymaas

@davxy: now pushing a new version that resolves the above issue. JamZig⚡ now passes all traces! 🤠


## Comment by @boymaas

@davxy 1755796851 was a straightforward threshold balance fix. I am now pushing the new version. JamZig⚡ is once again passing all traces 🤠



## Comment by @clearloop

> [@davxy](https://github.com/davxy) 1755796851 was a straightforward threshold balance fix. I am now pushing the new version. JamZig⚡ is once again passing all traces 🤠

I actually doubt about why the threshold is expected to be zero while the offset is zero and it should at least be `B_S`


## Comment by @boymaas

I assumed the threshold dropped to 0 because of the free storage offset. Now double checking the Graypaper. 


## Comment by @boymaas

This is how I interpret https://graypaper.fluffylabs.dev/#/7e6ff6a/118a01119201?v=0.6.7 

When a_f (storage_offset) is large enough to exceed the base costs, the formula yields a negative value, which max(0, ...) clamps to 0.

For example, with no storage (a_i = 0, a_o = 0) and a_f = 150:
      a_t = max(0, 100 - 150) = 0

This represents a service granted sufficient free storage that it requires no balance for its current usage.


## Comment by @boymaas

Goodevening @davxy. I have uploaded the v0.7.0 version of the fuzzer target. I look forward to the new reports 🤠 https://github.com/jamzig/conformance-releases


## Comment by @boymaas

Good morning @davxy, yesterday I pushed a new binary with all the debugging mechanics removed. You can find it in the usual place: https://github.com/jamzig/conformance-releases. The -v flags on the target will no longer function.


## Comment by @boymaas

Good evening @davxy, I have fixed the reports and am uploading a new version to the usual location: https://github.com/jamzig/conformance-releases. Thank you again.


## Comment by @boymaas

Good evening @davxy.  I focused my Sunday and today on optimising JamZig⚡. It seems I am passing all the reports from the last run, which is good news! I look forward to seeing the results on the dashboard after your next performance update run. These are my local optimisation results.

<img width="549" height="238" alt="Image" src="https://github.com/user-attachments/assets/9ec0aad8-f8ed-4eda-8b07-5a6d4e5eb197" />


## Comment by @boymaas

Thank you very much, @davxy, for running the performance test for JamZig⚡ today ❤️ I was expecting to see the results next week. Still some work for me to do I see 🔥 Back to the keyboard!


## Comment by @boymaas

Good morning @davxy, just pushed another release with various optimisations: https://github.com/jamzig/conformance-releases.


## Comment by @boymaas

Good morning @davxy, I just pushed a new binary that implements fuzzing protocol v1. I have not thoroughly tested the forking feature, as my fuzzer does not support it yet. 🤞


## Comment by @davxy

Hi. The protocol works, but unfortunately almost all the traces from v0.7.0 folder are rejected by JamZig with Error message  `Block import failed: AnchorNotInAncestry `.

We currently disable the ancestry feature in our `PeerInfo` message.

As reported here: https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#ancestry-m1

> When this feature is disabled, the check described in the GP reference should also be skipped.


## Comment by @boymaas

Good morning @davxy, could you please check something? In my header validation, I am determining what the author index should be. Essentially using: https://graypaper.fluffylabs.dev/#/38c4e62/0e1c040e3104?v=0.7.0. 

This works well in all epochs except the first. I am running the test vector traces. I tried all eta values to get it to work for epoch 0, but none seem effective. Could you double-check the eta values for epoch 0? Maybe that's where the issue lies.


## Comment by @boymaas

Good evening @davxy, I just pushed a new binary that implements fuzzing protocol v1: https://github.com/jamzig/conformance-releases.  It passes all the **minifuzzer** tests. However, I am still encountering the issue mentioned above. I decided not to check if the author_index is correct in the first epoch on a trace to work around the issue.


## Comment by @davxy

> could you please check something

Hopefully tomorrow :-)
In the meantime I updated your reports table column


## Comment by @boymaas

Good afternoon @davxy, thank you. All reports have been fixed. I have pushed a new version of the fuzz target to the usual location.


## Comment by @boymaas

Good evening @davxy. Here is the **v0.7.1 compliant release**. https://github.com/jamzig/conformance-releases. Passes all traces and vectors. In the coming days, I will push a compliant version for v0.7.2.


## Comment by @boymaas

Good evening @davxy, hereby the **v0.7.2 compliant release**. https://github.com/jamzig/conformance-releases


## Comment by @boymaas

Thank you for the wonderful Christmas gift 🎁, @davxy. In the meantime, I have updated the release here, where JamZig⚡ passes all 112 Christmas batch traces: https://github.com/jamzig/conformance-releases. May 2026 be a good year for all of us!


## Comment by @boymaas

Good evening @davxy, new years batch traces are all passing, updated same place: https://github.com/jamzig/conformance-releases. Went with the "implementers consensus" but have some questions on this one: https://github.com/davxy/jam-conformance/discussions/153
