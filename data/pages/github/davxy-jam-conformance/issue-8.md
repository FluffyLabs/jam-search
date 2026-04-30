---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/8'
title: JavaJAM
site: github.com/davxy/jam-conformance
created_at: '2025-08-05T12:32:58.000Z'
last_modified: '2025-08-05T12:32:58.000Z'
content_kind: issue
---

# JavaJAM

## Issue by @jaymansfield

Hey @davxy,

Here is a link to the JavaJAM releases (latest is 0.6.7.8):
https://github.com/javajamio/javajam-releases

Please note the one prerequisite in the readme.

Thanks!


## Comment by @davxy

@jaymansfield https://github.com/davxy/jam-stuff/tree/main/fuzz-reports/0.6.7/javajam/javajam-0.6.7_gp-0.6.7/1754582958


## Comment by @jaymansfield

Thanks @davxy 

I can get the test to pass if I disable this condition in the designate host call:

<img width="1152" height="112" alt="Image" src="https://github.com/user-attachments/assets/fe2deb23-64d7-4404-866c-35f380538d60" />

The service executing this is service 0, and in a previous bless host call it sets the designate service to 3057376672. Since they are not equal I am returning HUH.

Are you checking this condition in polkajam or am I misunderstanding it?


## Comment by @davxy

~AIUI, you compare $x_s$ to $(x_u)_v$, which is set to the prior-state designated service.  
The privileged services are updated at the end of the parallelizable accumulate `DELTA_*`.~

~Both `bless` and `designate` are called in the context of `service=0` accumulate.  
This means that [`DELTA_1`](https://graypaper.fluffylabs.dev/#/7e6ff6a/175502175802?v=0.6.7) is invoked once, using the prior **o** (which is then referred to as **x** in the host call body), and even if `bless` internally modifies the designate service value, in "designate" host call will still use the one passed in the `DELTA_1` parameters to perform the comparison.~

~Hope that makes sense.~

Fuzzer fixed to return HUH



## Comment by @jaymansfield

Thanks for that info @davxy 

Released a fix:
https://github.com/javajamio/javajam-releases/releases/tag/0.6.7.9


## Comment by @davxy

new report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/javajam/javajam-0.6.7_gp-0.6.7/1754725568


## Comment by @jaymansfield

Thank you @davxy.

Resolved in https://github.com/javajamio/javajam-releases/releases/tag/0.6.7.10

See release notes for fix details.


## Comment by @davxy

https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/javajam/javajam-0.6.7_gp-0.6.7/1754754058

The fuzzer didn't generate a diff report because your CLI crashed.  
I’ve uploaded the trace that triggers the fault.



## Comment by @jaymansfield

> https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/javajam/javajam-0.6.7_gp-0.6.7/1754754058
> 
> The fuzzer didn't generate a diff report because your CLI crashed. I’ve uploaded the trace that triggers the fault.

I fixed the CLI issue as well as a few other things I noticed in the trace. Since there was no report I didn't have the expected post-state, so hopefully with the changes it is okay now that it completes.

New build:  https://github.com/javajamio/javajam-releases/releases/tag/0.6.7.11

Thanks!


## Comment by @davxy

report: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/javajam/javajam-0.6.7_gp-0.6.7/1754990132


## Comment by @jaymansfield

hey @davxy,

The only difference we have for 00000012 is on gamma_z and i've gone through everything and can't seem to determine why.

I am using ark-vrf 0.1.0 and there are no offenders that I can see.

Public keys (from pre-state iota) I used to generate the ring root:

0746846d17469fb2f95ef365efcab9f4e22fa1feb53111c995376be8019981cc
151e5c8fe2b9d8a606966a79edd2f9e5db47e83947ce368ccba53bf6ba20a40b
9326edb21e5541717fde24ec085000b28709847b8aab1ac51f84e94b37ca1b66
2470d4b73e8a5efa8179c9efff6c7f038ece4aba5e97abfa0add3a1a542dee34  -> replaced with padding point because Public::deserialize_compressed failed
ff71c6c03ff88adb5ed52c9681de1629a54e702fc14729f6b50d2f0a76f185b3
2105650944fcd101621fd5bb3124c9fd191d114b7ad936c1d79d734f9f21392e

My result:
0xa3ef220318bc33925e9934022bb8838e3ca985f8d3276ab30d1d10945b89a41156e3dc7a317d9366ed6115d905926a92a489d807d884d2256d3fa8b5e2e3b2d2a3a2fa271bca277f3eed45d13f816da7132ac46f9fc900131611b75c1db068e592e630ae2b14e758ab0960e372172203f4c9a41777dadd529971d7ab9d23ab29fe0e9c85ec450505dde7f5ac038274cf

Expected value:
0xa904d861ad534ad7920ce2cc4e8c9e3af0494b5bafecd583c6c436fe58977ebafbfc468ed31180ed377f6b57c0d34a508dbf8d0182ea4515c850b4b33a5574dcfe2850a89e0909d88653c9134e0112cf6e3fc12f553a41bc39f909890102818b92e630ae2b14e758ab0960e372172203f4c9a41777dadd529971d7ab9d23ab29fe0e9c85ec450505dde7f5ac038274cf

Are you able to let me know what keys you are using to get that result?


## Comment by @davxy

It seems the issue is that you are replacing `2470d4b73e8a5efa8179c9efff6c7f038ece4aba5e97abfa0add3a1a542dee34`
with the padding point, while I am not.

For deserializing the public key, I am currently using `Public::deserialize_compressed_unchecked`, which only verifies that
the bytes correspond to a valid point on the Bandersnatch curve. The `deserialize_compressed_checked` variant additionally ensures that the point lies in the prime subgroup.

I think it is fine to use the unchecked variant, since it is faster and, under normal circumstances, this situation should never occur. The service responsible for proposing keys to JAM verifies a PoP (Proof of Possession) for each key, so in practice an invalid key would never reach JAM, as it would be removed beforehand.

NOTE: I'm always using `deserialize_compressed_unchecked` for everything!



## Comment by @jaymansfield

Thank you @davxy.

That resolved my issue.

New build: 
https://github.com/javajamio/javajam-releases/releases/tag/0.6.7.12


## Comment by @davxy

+2 reports: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/javajam


## Comment by @jaymansfield

> +2 reports: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/javajam

Both resolved @davxy. They had the same issue and one fix resolved both.

New build: https://github.com/javajamio/javajam-releases/releases/tag/0.6.7.14

Please re-run, thanks!


## Comment by @jaymansfield

Also verified that the last javajam build above also passes all of the reports in the new shared archive (/fuzz-reports/archive/0.6.7) for folders that contain a report.json file. Very useful, thanks.


## Comment by @davxy

+2 reports


## Comment by @jaymansfield

> +2 reports

Thanks @davxy.

My useless ticket validation did not take into consideration the block triggering an epoch change which caused 00000130, and the other was just a state persistence issue unrelated to the STF.

Both were quick fixes and are resolved in: 
https://github.com/javajamio/javajam-releases/releases/tag/0.1.15

Note: I changed how I did version numbers for JavaJAM, but it doesn't look like it will effect your download/run scripts.


## Comment by @sourabhniyogi

> This means that [`DELTA_1`](https://graypaper.fluffylabs.dev/#/7e6ff6a/175502175802?v=0.6.7) is invoked once, using the prior **o** (which is then referred to as **x** in the host call body), and even if `bless` internally modifies the designate service value, in "designate" host call will still use the one passed in the `DELTA_1` parameters to perform the comparison.

We ended up with the same situation -- and will follow the advice that the designate `HUH` check uses the prior **o** (the x "context" one passed in the `DELTA_1` parameters) to perform the comparison.  But we don't know where this comes from in GP -- can you explain it?  

We understand that to win parallelized service accumulation, we really want to start each individual service with the prior **o**.  OK, but within a single service accumulation (DELTA_1), all host functions use an evolving x context, where the single accumulation starts with **o**, yes, but
(1) a `bless` function mutates **x**
(2) the `designate` uses the mutated **x** from (1)
because its within the same service.   Having each host function call start from **o** makes no sense -- like what would a host function call to  `checkpoint` do after (1) or (2) if each host function call started afresh?  



## Comment by @davxy

@sourabhniyogi looks like you're right indeed. I'm going to double check, and eventually fix the reports in the archive if some are incorrect. Ty for reporting


## Comment by @ascrivener

I believe I am in the same situation for what it's worth. My designate does a HUH on https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/jamduna/jam-duna-target-v0.13-0.6.7_gp-0.6.7/1755150526


## Comment by @davxy

Yes. I fixed it

https://github.com/davxy/jam-conformance/issues/8#issuecomment-3165053335

@jaymansfield 


## Comment by @jaymansfield

> Yes. I fixed it
> 
> [#8 (comment)](https://github.com/davxy/jam-conformance/issues/8#issuecomment-3165053335)
> 
> [@jaymansfield](https://github.com/jaymansfield)

Thank you @davxy and @sourabhniyogi.

I've pushed a new build.

https://github.com/javajamio/javajam-releases/releases/tag/0.1.16

Changes

Fix: New, Bless, Assign, and Designate host calls now use the "modified" privileged service indexes again. [#8](https://github.com/davxy/jam-conformance/issues/8#issuecomment-3165053335)
Fix: Updated B.10 (new service identifier calculation) to use compact encoding for service and slot. [Boka finding](https://github.com/davxy/jam-conformance/issues/16#issuecomment-3190838048)


## Comment by @jaymansfield

Looks like I missed a folder: 1755252727 -- everything under fuzz-reports/javajam/0.6.7 should pass now.

New build again with one additional fix:

https://github.com/javajamio/javajam-releases/releases/tag/0.1.17

Changes

Fix: Added validation for ticket attempt numbers for tickets mark in the block header.


## Comment by @jaymansfield

hey @davxy,

Just wanted to mention Javajam is missing from the reports table:
https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/README.md



## Comment by @jaymansfield

Updated build with a few fixes/enhancements (unrelated to the current fuzzing):

https://github.com/javajamio/javajam-releases/releases/tag/0.1.18


## Comment by @jaymansfield

For the new reports it seems at least half of them have accumulateGasUsed=0 in the expected post state statistics. Javajam accumulated these and used gas for all of them.

One thing I noticed is for those work reports all of their refine results were BAD. Do you happen to skip accumulation for work reports with a result of BAD? I can't seem to find anything in the GP that suggests to do this.


## Comment by @davxy

I'll have a look tomorrow. It seems that we're doing something bad here 


## Comment by @jaymansfield

Here is a bit more analysis on the current differences:

-------
1755530509/00000004 - My node rejects this block after doing the ancestry set check:

The block has:
Anchor: 0x6975a6da26c177b4c4beaf88f3d5158b6cb5152f89e131dfe689332efc7d0300
lookup_anchor_slot: 2

The actual slot for that anchor is 3 in 00000003.json.

**Question**: Should we be worrying about ancestry set here? I could disable this check when it's in fuzz mode.

-------

All of these have the accumulate gas = 0 for a work report with an available preimage (mentioned in my previous comment):

1755530535
1755531000
1755531322
1755531375
1755531419
1755531480

-------

These two seem to be due to polkajam charging gas per basic block and other implementations are charging per instruction. This is the first time its noticeable since we have not had vectors with page faults included before:

1755530728
1755530896

-------

Still investigating:
1755531081 - TBD
1755531179 - TBD



## Comment by @jaymansfield

I've looked at 1755530509/00000004 a bit more and think I may be right about rejecting the block.

It is failing this ancestor set condition:

<img width="670" height="53" alt="Image" src="https://github.com/user-attachments/assets/186b3853-4892-4775-839a-62a290bbea70" />

The lookup anchor slot is wrong in the report guarantee.

The block has:
Anchor: 0x6975a6da26c177b4c4beaf88f3d5158b6cb5152f89e131dfe689332efc7d0300
lookup_anchor_slot: 2

The actual slot for that anchor is 3 in 00000003.json.

@davxy can you confirm if this is correct or if I should disable the ancestor set check while in fuzz mode? Guess it depends if others are taking into consideration loading chains of blocks, versus block by block fuzzing.


## Comment by @ascrivener

FWIW, I turned off (11.35) in my fuzzer, in response to https://github.com/davxy/jam-conformance/issues/12#issuecomment-3193578614

The fuzzer testing strategy as it is now is not able to fully test 11.35 without also adding a list of ancestor blocks to the test vector. i guess we could also change it to being a single "test vector" which is a sequence of blocks being imported. but i'll leave that to @davxy 


## Comment by @jaymansfield

New JavaJAM build resolving all current differences:

https://github.com/javajamio/javajam-releases/releases/tag/0.1.19

Fix: Disable ancestry set tracking and validation when running in fuzz mode.
Fix: Remove extra gas charge on page faults that was only added for PVM test vector conformance (as described [here](https://github.com/w3f/jamtestvectors/pull/3#issuecomment-2990855379)).


## Comment by @davxy

IMO it makes sense to keep 0.6.7 as is (skipping the 11.35 check), mainly to avoid invalidating all traces.  
From 0.7.0 (to be released soon), the best option is to include the ancestry set **A** with the trace data.

Since many share this concern, I'll add it to the NEWS.


## Comment by @jaymansfield

GP 0.7.0 target:
https://github.com/javajamio/javajam-releases/releases/tag/0.2.1


## Comment by @jaymansfield

Forgot to update my config to specify 0.7.0 for the peer info handshake in that last build.

Resolved in:
https://github.com/javajamio/javajam-releases/releases/tag/0.2.2



## Comment by @davxy

```bash
❯ ls
assets  conf                      libjavajam_bandersnatch.so  libjavajam_erasure_coding.so  logs
bin     javajam-linux-x86_64.jar  libjavajam_bls.so           libjavajam_pvm_recompiler.so

targets/javajam/latest on  main [$!+] via ☕ v24.0.2
❯ ./bin/javajam
Error: No javajam JAR file found in /mnt/ssd/develop/jam/jam-conformance/scripts/targets/javajam/latest
```


## Comment by @jaymansfield

> ❯ ls
> assets  conf                      libjavajam_bandersnatch.so  libjavajam_erasure_coding.so  logs
> bin     javajam-linux-x86_64.jar  libjavajam_bls.so           libjavajam_pvm_recompiler.so
> 
> targets/javajam/latest on  main [$!+] via ☕ v24.0.2
> ❯ ./bin/javajam
> Error: No javajam JAR file found in /mnt/ssd/develop/jam/jam-conformance/scripts/targets/javajam/latest

Checking..


## Comment by @jaymansfield

Thanks @davxy.

Should be resolved in:
https://github.com/javajamio/javajam-releases/releases/tag/0.2.4

Changes:

Fix: Start script updated to resolve JAR correctly when run from a symlinked path.


-----

EDIT: Had to make one more change, but tested and looks to be working now.


## Comment by @jaymansfield

Updated build with several PVM (interpreter) performance enhancements:
https://github.com/javajamio/javajam-releases/releases/tag/0.2.7


## Comment by @jaymansfield

Hey @davxy,

Updated build with a number of performance enhancements:
https://github.com/javajamio/javajam-releases/releases/tag/0.2.10

Pretty significant difference when executing the entire suite of traces. About a 65% drop in overall execution time.

Thanks!


## Comment by @jaymansfield

Hey davxy,

1756548916 has been resolved. I was using the max refine gas constant from the GP rather then the tiny setting.

https://github.com/javajamio/javajam-releases/releases/tag/0.2.12

I also made more performance enhancements. Another very noticeable improvement, another 50%+ drop in execution time when running the entire trace suite.

Thank you.


## Comment by @jaymansfield

Hey @davxy,

The last item for me 1756548741 is now resolved.

https://github.com/javajamio/javajam-releases/releases/tag/0.2.13

Would be great if a speed check can be done as well a lot has changed and I think its at a more competitive state now.

Thanks!




## Comment by @jaymansfield

New build for next time you fuzz javajam:

https://github.com/javajamio/javajam-releases/releases/tag/0.2.14

Some small tweaks to host functions, and a big PVM refactor to improve accumulation times.


## Comment by @jaymansfield

Hey @davxy.

New JavaJAM build again.
https://github.com/javajamio/javajam-releases/releases/tag/0.2.15

Few more PVM performance enhancements plus some tweaks to host function validations.

Thanks!


## Comment by @davxy

Hey @jaymansfield, in the latest version of `target.sh`, each target is now executed inside a Docker container - even those distributed as binaries (these are run in a `debian:stable-slim` container :  

https://github.com/davxy/jam-conformance/blob/f9e3f61acae656757fc7c1dc7ce85d833f7854c3/scripts/target.sh#L456-L458  

Most targets work fine with the standard with debian container. The exception is **javajam**, which requires `java` to be available in the `PATH`.  

I see three possible approaches:  

1. Extend `debian-slim` to include Java and thus I have to publish a custom image (which I prefer to avoid).  
2. (If possible) modify your binary so it doesn’t require `java` in the `PATH` ? Maybe by bundling the runtime inside it? I noticed `jamixir` and `tsjam` seem to do something similar with `helixir` and `typescript` (node.js???), though I’m not an expert in java/helixir/ts languages  
3. Provide a dedicated Docker image for **javajam**, similar to what **boka** and **turbojam** do.  



## Comment by @jaymansfield

> Hey [@jaymansfield](https://github.com/jaymansfield), in the latest version of `target.sh`, each target is now executed inside a Docker container - even those distributed as binaries (these are run in a `debian:stable-slim` container :
> 
> [jam-conformance/scripts/target.sh](https://github.com/davxy/jam-conformance/blob/f9e3f61acae656757fc7c1dc7ce85d833f7854c3/scripts/target.sh#L456-L458)
> 
> Lines 456 to 458 in [f9e3f61](/davxy/jam-conformance/commit/f9e3f61acae656757fc7c1dc7ce85d833f7854c3)
> 
>  TARGETS[$target.image]="$SENSIBLE_DOCKER_IMAGE" 
>  TARGETS[$target.cmd]="./$command $args" 
>  run_docker_image "$target" 
> Most targets work fine with the standard with debian container. The exception is **javajam**, which requires `java` to be available in the `PATH`.
> 
> I see three possible approaches:
> 
> 1. Extend `debian-slim` to include Java and thus I have to publish a custom image (which I prefer to avoid).
> 2. (If possible) modify your binary so it doesn’t require `java` in the `PATH` ? Maybe by bundling the runtime inside it? I noticed `jamixir` and `tsjam` seem to do something similar with `helixir` and `typescript` (node.js???), though I’m not an expert in java/helixir/ts languages
> 3. Provide a dedicated Docker image for **javajam**, similar to what **boka** and **turbojam** do.

Opened PR.


## Comment by @jaymansfield

Pushed a new build again @davxy.

Mostly performance improvements but should see big improvements to the storage traces.

Thanks!


## Comment by @jaymansfield

New JavaJAM v0.2.19 now has future slot validation turned off when fuzzing (@davxy).

1757092821 will pass now.

Thank you.


## Comment by @jaymansfield

Hey @davxy 

New JavaJAM has been published that resolves 1757422206 and has several more performance enhancements.

Thanks!


## Comment by @jaymansfield

Found a bug and released a new build. 

Please update before fuzzing again! Thanks.


## Comment by @jaymansfield

hey @davxy,

Pushed a new release compatible with the [new fuzzer spec ](https://github.com/davxy/jam-conformance/pull/47)(forks and ancestry enabled).

Thanks again.


## Comment by @davxy

@jaymansfield https://github.com/davxy/jam-conformance/pull/47#issuecomment-3285996497


## Comment by @jaymansfield

> [@jaymansfield](https://github.com/jaymansfield) [#47 (comment)](https://github.com/davxy/jam-conformance/pull/47#issuecomment-3285996497)

Thanks. Error message has been added.


## Comment by @davxy

I see that during the handshake you are turning off the `fork` feature. Is that not supported yet?


## Comment by @jaymansfield

> I see that during the handshake you are turning off the `fork` feature. Is that not supported yet?

I’ll make a new build as soon as I can. I thought it was enabled.


## Comment by @davxy

no rush :-D 


## Comment by @jaymansfield

Forks and ancestry should be enabled now.


## Comment by @davxy

Using `minifuzz` (https://github.com/davxy/jam-conformance/pull/85) I found that you are sending some extra bytes at the end of the error message.

```
❯ ./minifuzz.py -d ../examples/v1/
Found 31 fuzzer files to process
Connected to target socket: /tmp/jam_target.sock

==========================================================================
Processing pair 1: 00000000_fuzzer_peer_info.bin -> 00000000_target_peer_info.bin
TX: peer_info
RX: peer_info

==========================================================================
Processing pair 2: 00000001_fuzzer_initialize.bin -> 00000001_target_state_root.bin
TX: initialize
RX: state_root

==========================================================================
Processing pair 3: 00000002_fuzzer_import_block.bin -> 00000002_target_error.bin
TX: import_block
Error decoding target response: Decoding <FuzzerMessage> - Current offset: 19 / length: 22
Connection closed
```


## Comment by @jaymansfield

@davxy Thanks. Error message encoding is fixed in the latest release.

It now passes up until here "Processing pair 30: 00000029_fuzzer_import_block.bin -> 00000029_target_state_root.bin" which i see from the README is supposed to fail.


## Comment by @jaymansfield

Forks, no-forks, and faulty all passing @davxy.

By the way I just pushed another build with some other enhancements that have been in progress (changes are not related to the minifuzz). My average import time should have a significant reduction overall (at least a 40% less) next time benchmarks are ran.


## Comment by @jaymansfield

Hey @davxy,

Just pushed a new JavaJAM build again with a huge rewrite of my PVM. Wasn't happy with my performance so hopefully this puts me in a better position. Praying nothing breaks but my unit tests and comparison script I wrote all match still so I might be good. New numbers are looking much better. This should be the end of my performance updates for now (unless things look different from the fuzzer side).

<img width="358" height="116" alt="Image" src="https://github.com/user-attachments/assets/2fd96843-b0f8-4b2e-a07e-261d68f77aa3" />


## Comment by @jaymansfield

Hey @davxy,

All traces should pass with the latest javajam build that was published.

Main change was sorting the transfers returned in the fetch call (this resolved almost all of them).

Thanks.


## Comment by @jaymansfield

1758621952 should be resolved now. Previously my fix for [#98](https://github.com/davxy/jam-conformance/discussions/98) wasn't taking into consideration updating the privileged service back to the manager service.

Thanks @davxy.


## Comment by @jaymansfield

Hey @davxy,

Latest JavaJAM release supports 0.7.1 now.

Thank!


## Comment by @jaymansfield

Hey @davxy, just a heads up that I've pushed a new build.

Thanks.


## Comment by @jaymansfield

Hey @davxy, pushed a new JavaJAM release today.

Thanks.


## Comment by @jaymansfield

New JavaJAM build has been released that passes both the new fuzzy traces and resolves all of the current 0.7.1 reports.

Thanks @davxy.


## Comment by @jaymansfield

Hello @davxy .

I pushed a new build resolving 1763371531 (fuzz-round branch) and 1763488465, 1763489287 (fuzz-round-2 branch).

Thanks!


## Comment by @davxy

@jaymansfield, is the "warm-up" phase during startup essential? Or is it mainly for performance improvement? If it's not strictly necessary, would it be possible to offer an option to disable it to speed up startup? Since the binary is restarted multiple times during testing (once per trace), this slows the process. It's not a major issue, but if it's a minor change on your side, having this option would be helpful for testing



## Comment by @jaymansfield

> [@jaymansfield](https://github.com/jaymansfield), is the "warm-up" phase during startup essential? Or is it mainly for performance improvement? If it's not strictly necessary, would it be possible to offer an option to disable it to speed up startup? Since the binary is restarted multiple times during testing (once per trace), this slows the process. It's not a major issue, but if it's a minor change on your side, having this option would be helpful for testing

@davxy It's really only needed for performance runs. Java dynamically optimizes code during runtime so this warmup allows the initial block import to start at a higher speed (rather then ramping up after a few blocks).

I just pushed a new build that would allow you to disable it. If you change from:

"cmd": "fuzz {TARGET_SOCK}"

to

"cmd": "-Dskip.warmup=true fuzz {TARGET_SOCK}"

It should skip it. Should make a difference if the target is being restarted a lot. I think I was under the assumption the process would stay running between tests and set state would be used to "reset" it to process something else.


## Comment by @davxy

Works! Ty


## Comment by @jaymansfield

1763487981 and 1763488328 should pass now in the latest build. My node was rejecting them but was closing the connection after (since the parent blocks were not found in its DB and it considered it an initialization issue). They should return an error now instead.

Thanks @davxy.


## Comment by @jaymansfield

hey @davxy,

Latest JavaJAM (v0.3.19) is now targeting GP 0.7.2. 

Thanks!


## Comment by @jaymansfield

Pushed a new JavaJAM build with various fixes done in the past week. 

Thanks @davxy.


## Comment by @davxy

@jaymansfield you have a regression. The target started failing with almost all the traces.

https://pastes.io/jj-fails


## Comment by @jaymansfield

> [@jaymansfield](https://github.com/jaymansfield) you have a regression. The target started failing with almost all the traces.
> 
> https://pastes.io/jj-fails

Thanks @davxy, have reverted the build back for now. 


## Comment by @jaymansfield

@davxy latest JavaJAM build supports the new fuzzer env variables.
