---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/30'
title: Jampy
site: github.com/davxy/jam-conformance
created_at: '2025-08-22T07:53:23.000Z'
last_modified: '2025-08-22T07:53:23.000Z'
content_kind: issue
---

# Jampy

## Issue by @dakk

Hi Davxy, I updated my fuzzer-target to 0.7.0 and made a release; you can find the latest version here: https://github.com/dakk/jampy-releases/blob/main/dist/jampy-target-0.7.0_x86-64.zip (updates to the target on the same gp releases keeps the same URI)

If you run it as-is, it create a socket `/tmp/jam_target.sock` using `tiny` env.

```
usage: jampy-target-0.7.0_x86-64 [-h] [--env {tiny,full}] [--socket-file SOCKET_FILE] [--version]

Jampy target

options:
  -h, --help            show this help message and exit
  --env {tiny,full}     Specify environment mode: 'tiny' or 'full' (default: 'tiny')
  --socket-file SOCKET_FILE
                        Specify the socket file (default: '/tmp/jam_target.sock')
  --version             Print the jampy and jam version and exit
```

I know traces for 0.7.0 are not ready yet, so I think you can wait, I'm just putting a placeholder. Thank you


## Comment by @davxy

@dakk I get this on first block

```
❯ ./target.sh run jampy
Run jampy on /mnt/ssd/develop/jam/jam-conformance/scripts/targets/jampy/d4d8992
Waiting for target termination (pid=140498)
Jampy target is listening on /tmp/jam_target.sock
New connection: fd=4
Received: PeerInfo
Received peer info: PeerInfo(fuzzer, version=0.1.25, jam_version=0.7.0)
Sent: PeerInfo
Received: SetState
Sent: StateRoot
Received: ImportBlock
2025-08-23 17:21:01 DEBUG    jampy.chainstate ⏩ Processing block: 0x74ad675f8d6480a17b6ec0178962ea0166053c384689044c6f4cd38c97c2776d

thread '<unnamed>' panicked at src/lib.rs:43:41:
called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
Traceback (most recent call last):
  File "jampy/fuzzer/target.py", line 162, in <module>
  File "jampy/fuzzer/target.py", line 158, in main
  File "jampy/fuzzer/target.py", line 128, in targetfails
  File "jampy/fuzzer/target.py", line 73, in target_handle_connection
  File "jampy/chainstate.py", line 412, in process_block
  File "jampy/safrole/safrole.py", line 420, in next
  File "jampy/crypto/vrf.py", line 97, in __init__
pyo3_runtime.PanicException: called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
[PYI-140498:ERROR] Failed to execute script 'target' due to unhandled exception!
```


Edit: this triggers when my current folder is not the one of the binary (I start the target from a different folder). And perhaps fails to find the ring-vrf SRS file. Can this be fixed?


## Comment by @davxy

Second issue. 

If I start the binary from the binary folder:

```bash
❯ ./jampy-target-0.7.0_x86-64 --socket-file /tmp/jam_target.sock
Jampy target is listening on /tmp/jam_target.sock
New connection: fd=4
Received: PeerInfo
Received peer info: PeerInfo(fuzzer, version=0.1.25, jam_version=0.7.0)
Sent: PeerInfo
Received: SetState
Sent: StateRoot
Received: ImportBlock
2025-08-23 17:24:29 DEBUG    jampy.chainstate ⏩ Processing block: 0x74ad675f8d6480a17b6ec0178962ea0166053c384689044c6f4cd38c97c2776d
2025-08-23 17:24:29 DEBUG    jampy.chainstate ❎ Failed SAFROLE transition: bad_sealing_signature
Invalid block, reverted
Sent: StateRoot
Received: GetState
Sent: State
recv_message raised an exception, disconnecting: Disconnected, waiting a new connection
```

It rejects the first block, which is a  valid block.
I see from your log a bad sealing signature? I can share the traces with you, so you can try to import it locally


## Comment by @davxy

https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.7.0/jampy/1755963007


## Comment by @dakk

There are some env issue on the binary, your trace runs fine on my test runner. Anyway I have 6 failing traces, I will focus on them before fixing the fuzzer target 👍 


## Comment by @dakk

@davxy I may have fixed the path and sealing issue, and uploaded to the same url. I'm still having an issue with preimages/00000095.json and preimages/00000099.json traces, the rest seems working.


## Comment by @dakk

@davxy can you update the jampy target to the latest version? I'm getting the exp stateroot you provied in the report [1755963007](https://github.com/davxy/jam-conformance/tree/first-0.7.0-batch/fuzz-reports/0.7.0/reports/jampy/1755963007)

I'm getting the same state of others for the block 1756393301.


## Comment by @dakk

Hello @davxy , jampy latest target fixes the issue with ffi; can you schedule an update of our perf?


## Comment by @dakk

@davxy : I can pass 1756548916_00000082 setting `K=3`, but doing so I'm failing safrole tests, where I see some extrinsics with more than 3 tickets. Are safrole and fuzzer aligned with the same constants values?

Anyway, I updated my target and now I'm only having a gas discrepancy in 1756572122_00001810 for service 0 statistics:
```diff
@@ -655,7 +655,7 @@
         "id": 0,
         "record": {
           "accumulate_count": 1,
-          "accumulate_gas_used": 3098,
+          "accumulate_gas_used": 3093,
           "exports": 0,
           "extrinsic_count": 0,
           "extrinsic_size": 0,
```


## Comment by @davxy

For the tiny case, the maximum number of tickets was always set to 3. Which safrole tests are failing?
Also, does 1756548916_00000082 contain some safrole-related checks? IIRC not. Could you refresh my memory? 🙂


## Comment by @dakk

> For the tiny case, the maximum number of tickets was always set to 3. Which safrole tests are failing? Also, does 1756548916_00000082 contain some safrole-related checks? IIRC not. Could you refresh my memory? 🙂

My bad, I wrote >= instead of >, please forget what I said about it. It doesn't contain safrole checks, but the fetch get the value of K, I was failing some traces because of it.

I'm only failing 1756572122_00001810 for gas reason, I try to figure out the issue in the next days.


## Comment by @dakk

<img width="658" height="415" alt="Image" src="https://github.com/user-attachments/assets/36c0585e-30cd-47b8-a481-83f05180e93e" /> you can test the latest jampy binary, everything seems working fine now


## Comment by @dakk

@davxy I uploaded a newer version of jampy handling edge cases discovered in https://github.com/davxy/jam-conformance/pull/52


## Comment by @dakk

@davxy I uploaded an updated version of jampy addressing some issues discovered on latest reports.


## Comment by @dakk

@davxy My latest target binary now implements fuzzer v1: https://github.com/dakk/jampy-releases/blob/main/dist/jampy-target-0.7.0_x86-64.zip


## Comment by @dakk

Hi @davxy , I've updated the target in order to fix an issue on target message reply in case of error.


## Comment by @dakk

Hi @davxy , I updated my binaries fixing the no-forks.


## Comment by @dakk

Hi @davxy , I updated my binaries fixing some faults


## Comment by @dakk

Hi @davxy , I updated jampy to 0.7.1 and released the target: https://github.com/dakk/jampy-releases/raw/refs/heads/main/dist/jampy-target-0.7.1_x86-64.zip


## Comment by @davxy

@dakk 

I'm checking your implementation. I see two issues.

---

Fails importing the traces defined in jam-test-vectors ( preimages, storage, fuzzy FAIL ; fallback, safrole PASS).

The error your target outputs:

```log
2025-10-27 07:32:35 DEBUG    jampy.chainstate ⏩ Processing block: 0xc303a84cada61b2e074f92db8e790b0f51353b07cc3d9f6808e0c4d2cf15629e
Ietf signature verified
Ietf signature verified
2025-10-27 07:32:35 DEBUG    jampy.chainstate ✅ SAFROLE transition
2025-10-27 07:32:35 DEBUG    jampy.chainstate ✅ DISPUTES transition
2025-10-27 07:32:35 DEBUG    jampy.chainstate ✅ REPORTS transition
Traceback (most recent call last):
  File "jampy/fuzzer/target.py", line 170, in <module>
  File "jampy/fuzzer/target.py", line 166, in main
  File "jampy/fuzzer/target.py", line 136, in target
  File "jampy/fuzzer/target.py", line 76, in target_handle_connection
  File "jampy/grandpa.py", line 59, in process_block
  File "jampy/chainstate.py", line 521, in process_block
  File "jampy/services/services.py", line 624, in next
  File "jampy/services/services.py", line 484, in state_integration
  File "jampy/services/accumulationfunctions.py", line 411, in outer_accumulation
  File "jampy/services/accumulationfunctions.py", line 223, in parallelized_accumulation
  File "jampy/services/accumulationfunctions.py", line 172, in delta_s
  File "jampy/services/accumulationfunctions.py", line 120, in single_service_accumulation
  File "jampy/pvm/hostcalls/accumulate.py", line 909, in pvm_accumulate_invoke
  File "jampy/pvm/hostcalls/hostcallfun.py", line 161, in pvm_program_argument_invoke
  File "jampy/pvm/hostcalls/hostcallfun.py", line 89, in pvm_host_call_invoke
  File "jampy/pvm/invocation.py", line 294, in pvm_invoke_merged
  File "jampy/pvm/astutils.py", line 101, in ast_fuse_funcs
  File "jampy/pvm/astutils.py", line 75, in get_ast_of_opc
  File "inspect.py", line 1285, in getsource
  File "inspect.py", line 1267, in getsourcelines
  File "inspect.py", line 1096, in findsource
OSError: could not get source code
[PYI-7:ERROR] Failed to execute script 'target' due to unhandled exception!
Jampy target is listening on /tmp/jam_target.sock
New connection: fd=4
Received: PeerInfo
Received peer info: PeerInfo(fuzzer, version=0.1.26, jam_version=0.7.1, fuzz_version=1, fuzz_features=Features(ancestry=False, fork=True, reserved=False))
Fuzzer is running another version: (0, 7, 1) != (0, 7, 0)
Sent: PeerInfo
Received: Initialize
Sent: StateRoot
Received: ImportBlock
New highest slot: 1
Sent: StateRoot
Received: ImportBlock
New highest slot: 2
Deleting 0xc3a409492e977b6a0037b3ef8964a4f176592df7e588af140236b48b2be7afec
Sent: StateRoot
Received: ImportBlock
New highest slot: 3
Deleting 0x0622df7c764f9f8189dbfd45336e882f053a8d91351abca1fa3cc96436c76655
Sent: StateRoot
Received: ImportBlock
```

---

Minor: you haven't updated the jam version sent during the handshake - I'm still receiving 0.7.0.


## Comment by @dakk

@davxy There is an issue in the pvm recompiler with the compiled release of jampy.
I switched off it and pushed an updated version (and updated version numbers as well)


## Comment by @dakk

In the latest table I see "jampy (python) - FuzzyFail", but I can run fuzzy tests on my side and I don't see X con the table; is it a mistake?


## Comment by @davxy

> is it a mistake?

Fixed


## Comment by @dakk

I sent an updated version of jampy fixing some bugs; it now should match all conformance


## Comment by @dakk

`jam-conformance/fuzz-reports/0.7.1/reports/jampy/1763371155/report.json` is empty (and I'm passing the test locally), so I suppose jampy is wrongly reported as failing 1763371155 in the table


## Comment by @dakk

@davxy I updated jampy target release fixing a recursion bug discovered with the last batch.


## Comment by @davxy

Hey. I'm observing a major regression for your target:
```
jampy: 🔴 1761552708
jampy: 🔴 1761552851
jampy: 🔴 1761553047
jampy: 🔴 1761553072
jampy: 🔴 1761553157
jampy: 🔴 1761553506
jampy: 🔴 1761553554
jampy: 🟢 1761650152
jampy: 🟢 1761650657
jampy: 🟢 1761651476
jampy: 🟢 1761651616
jampy: 🟢 1761651767
jampy: 🟢 1761651837
jampy: 🟢 1761652427
jampy: 🔴 1761652768
jampy: 🔴 1761653013
jampy: 🔴 1761653121
jampy: 🔴 1761653246
jampy: 🔴 1761654464
jampy: 🔴 1761654584
jampy: 🔴 1761654684
jampy: 🔴 1761655910
jampy: 🔴 1761656086
jampy: 🔴 1761661472
jampy: 🔴 1761661586
jampy: 🔴 1761662449
jampy: 🟢 1761662834
jampy: 🔴 1761663151
jampy: 🔴 1761663633
jampy: 🔴 1761663744
jampy: 🟢 1761663992
jampy: 🔴 1761664166
jampy: 🔴 1761664407
jampy: 🔴 1761664779
jampy: 🔴 1761665051
jampy: 🔴 1761665268
jampy: 🔴 1761665434
jampy: 🔴 1761665520
jampy: 🔴 1761666724
jampy: 🔴 1761667005
jampy: 🔴 1761667093
jampy: 🔴 1763370844
jampy: 🟢 1763370944
jampy: 🔴 1763371072
jampy: 🟢 1763371098
jampy: 🔴 1763371127
jampy: 🔴 1763371155
jampy: 🔴 1763371341
jampy: 🔴 1763371379
jampy: 🔴 1763371498
jampy: 🔴 1763371531
jampy: 🔴 1763371689
jampy: 🔴 1763371865
jampy: 🔴 1763371900
jampy: 🔴 1763371949
jampy: 🟢 1763371975
jampy: 🔴 1763371998
jampy: 🟢 1763372158
jampy: 🔴 1763372255
jampy: 🔴 1763372279
jampy: 🔴 1763372314
jampy: 🔴 1763372355
jampy: 🟢 1763399245
jampy: 🔴 1763487844
jampy: 🟢 1763487888
jampy: 🔴 1763487981
jampy: 🔴 1763487989
jampy: 🟢 1763488067
jampy: 🟢 1763488081
jampy: 🟢 1763488162
jampy: 🔴 1763488212
jampy: 🔴 1763488259
jampy: 🔴 1763488328
jampy: 🔴 1763488465
jampy: 🟢 1763489287
jampy: 🔴 1763489605
jampy: 🔴 1763489659
jampy: 🔴 1763489715
jampy: 🔴 1763489748
jampy: 🔴 1763489798
```


## Comment by @dakk

I may have uploaded a wrong version 2 hours ago; can you please try again with the new binary?


## Comment by @davxy

Fixed 


## Comment by @dakk

Jampy passes all 0.7.2 traces / stf; I uploaded an updated target: https://github.com/dakk/jampy-releases/blob/main/dist/jampy-target-0.7.2_x86-64.zip


## Comment by @dakk

@davxy I've uploaded an updated version of jampy including various fixes; it should passes xmas conformances (it does locally).


## Comment by @davxy

mmm... I don't see any difference. Have you published the new version?


## Comment by @dakk

you were right, I made a mistake with the name, sorry; now the usual path point to the latest jampy version


## Comment by @dakk

Latest version of jampy-releases fixes an issue with the fuzzing protocol and other minors, passing latest conformance batch.


## Comment by @davxy

Hey @dakk your target fails to start.
Please try using `target.py run jampy` from the scritps folder


## Comment by @dakk

@davxy what error do you get? It works on my computer:

<img width="1588" height="796" alt="Image" src="https://github.com/user-attachments/assets/e5d65e34-4853-46d8-982b-ecf2673de999" />




## Comment by @davxy

```
❯ ./targets/jampy/latest/jampy-target-0.7.2_x86-64/jampy-target-0.7.2_x86-64
fish: Job 1, './targets/jampy/latest/jampy-ta…' terminated by signal SIGILL (Illegal instruction)
```


## Comment by @dakk

@davxy unfortunately I'm unable to reproduce...

```
dakk@gentoo ~/Repositories/MyRepos/jampy/testvectors/jam-conformance/scripts $ ./targets/jampy/latest/jampy-target-0.7.2_x86-64/jampy-target-0.7.2_x86-64
Jampy target is listening on /tmp/jam_target.sock
```

Can you please try to remove the target, get again and rerun?

```rm -r targets/jampy/ && python target.py get jampy```

If the issue persist can you please share some detail of your setup? 

--- EDIT
I tried the target in a clean debian inside a vbox and I'm getting the illegal instruction; I'm inspecting with gdb this issue. I'll update you when the issue is fixed


## Comment by @dakk

@davxy should be fixed now; the builder script was embedding a version of openssl optimized for my cpu; now I modified the build script in order to perform the build inside a docker env, so it embeds portable versions of openssl. It was tricky to discover because it was working on my machine and also on docker inside my machine.
Let me know if it works also on your side.


## Comment by @davxy

Hey. I'd like to help fixing a bug I noticed in your impl which prevents you from correctly process mutations.
In practice you are too eager to remove the prior state (i.e. you remove prior state as soon as a block is imported). But you need to wait for something to be constructed on top of it...

---

Example:

🟢 imported / accepted
🟥 import fails.

```
+ ab9dda96bbfa4da8f5c70b786f8cc085b319af43a44638582961581b23cd2fd9 (root=2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842) 🟢
+--+ 055a95b78cfa324b5c054f154fc86ba6e0ca2882bc0d0995ed9707965590b0fa (root=9ecf74ac7ea6e569efe013a7094aaaccd7fffbd7bdfd244585435669426901b3) 🟢
   + b302caea722c1d7293c5453797f55022933f2a0af6422a523d38c86c5827b9a8 (root=2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842) 🟥
   + 21246652a697daae66bdfcc9031033a2ab8781f37f5120a21f52e8cf827bf204 (root=2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842) 🟥
   + 0a45873d61c64525a44fb83d4abef0a1f29c99adbbe39a1f79b2b37968af9bdb (root=2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842) 🟥
   + 7a60aa64cfd8802e0a58490c831f04a7e3dac4f5b9156d155b669d4fe4252a73 (root=d5f18dd9aefd823757e4376f15cd3f1e202c25e9eae9e96976325c5ec8fe7e96) 🟢
```

The three 🟥 blocks and the last 🟢 block are siblings of `0x055a...`, all built on top of `0xab9d...` (prev state root `0x2de9...`).

Your implementation imports only:

```
+ ab9dda96bbfa4da8f5c70b786f8cc085b319af43a44638582961581b23cd2fd9 (root=2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842) 🟢
+--+ 055a95b78cfa324b5c054f154fc86ba6e0ca2882bc0d0995ed9707965590b0fa (root=9ecf74ac7ea6e569efe013a7094aaaccd7fffbd7bdfd244585435669426901b3) 🟢
```

Only the first two blocks import. The siblings of `0x055a...` (which all reference prev state root `0x2de9...`) fail.

Your logs:

```
2026-04-22 13:47:36 INFO     jampy.chainstate 🏆 Block imported, current height is: 381 (0xab9dda96bbfa4da8f5c70b786f8cc085b319af43a44638582961581b23cd2fd9)
2026-04-22 13:47:36 INFO     jampy.chainstate 🏆 State root: 0x2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842
2026-04-22 13:47:36 INFO     jampy.grandpa  Deleting state 0x4dec9a45bc86d2ec9a723ea53512283c141b56137fd78fe0bd778206583aee0b with height 380 (best is 4294967295)
2026-04-22 13:47:36 DEBUG    jampy.grandpa  Memory: 62.3 MB
2026-04-22 13:47:36 DEBUG    jampy.chainstate ⏩ Processing block: 0x055a95b78cfa324b5c054f154fc86ba6e0ca2882bc0d0995ed9707965590b0fa
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ SAFROLE transition
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ DISPUTES transition
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ REPORTS transition
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ ACCUMULATION transition
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ BLOCK_HISTORY transition
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ AUTHORIZATION transition
2026-04-22 13:47:36 DEBUG    jampy.chainstate ✅ STATISTICS transition
2026-04-22 13:47:36 INFO     jampy.chainstate 🏆 Block imported, current height is: 382 (0x055a95b78cfa324b5c054f154fc86ba6e0ca2882bc0d0995ed9707965590b0fa)
2026-04-22 13:47:36 INFO     jampy.chainstate 🏆 State root: 0x9ecf74ac7ea6e569efe013a7094aaaccd7fffbd7bdfd244585435669426901b3
2026-04-22 13:47:36 INFO     jampy.grandpa  Deleting state 0x2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842 with height 381 (best is 4294967295)
2026-04-22 13:47:36 DEBUG    jampy.grandpa  Memory: 62.3 MB
2026-04-22 13:47:36 INFO     jampy.grandpa  Invalid prev_state_root 0x2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842
2026-04-22 13:47:36 INFO     jampy.grandpa  Invalid prev_state_root 0x2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842
2026-04-22 13:47:36 INFO     jampy.grandpa  Invalid prev_state_root 0x2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842
2026-04-22 13:47:36 INFO     jampy.grandpa  Invalid prev_state_root 0x2de980dde03aab6734f6fa2669c8bf2c325e37d0453e02d7b158837776361842
```

From the log sequence:

1. `0xab9d...` is imported, producing state root `0x2de9...`.
2. `0x055a...` is imported on top of it, producing state root `0x9ecf...`
3. Immediately after importing `0x055a...`, state `0x2de9...` is deleted.
4. The siblings of `0x055a...` then fail to import with `Invalid prev_state_root 0x2de9...`, because the state they need as their base has just been removed.

The prior state is being pruned too eagerly. A parent state should not be discarded as soon as one child block is imported on top of it, since other siblings may still need it as their prev state.

You know that parent state is no longer required as soon as something is imported on top of one of the children.
(e.g. if something is imported on top of `7a60aa64...`)


## Comment by @dakk

Hey davxy, thank you for analyzing the behavior of jampy; the issue was that I used the timeslot in order to detect when a state is not necessary anymore, while I need to check if a state has nephews in order to remove it. (Hope this time I get it correctly)

This opens a new question; if I have different children from a parent, and the chain continue on one of these child, from what I understand I have to keep all the unused children since no block is imported on top of it, is it correct? 

I uploaded a new version addressing this correctly (🤞)


## Comment by @davxy

> This opens a new question; if I have different children from a parent, and the chain continue on one of these child, from what I understand I have to keep all the unused children since no block is imported on top of it, is it correct?

If the chain continues on one of these children, you **DO NOT** need to retain the unused ones, since no block is imported on top of it.

Concretely, consider a block $B_0$ with posterior state $S_0'$. You need $S_0'$ to import any children of $B_0$. Suppose $B_0$ has three children: $B_{11}$, $B_{12}$, and $B_{13}$. You must keep $S_0'$ around in order to **attempt** to import each of these children. However, as soon as a new block $B_{2}$ is built on top of some $B_{1i}$, you can discard any $B_{1i}$ sibling) as well as $S_0'$ (as you don't need it anymore).

This behavior is somehow described here: https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#forking-m1. If any part of the description is unclear or could be improved, feel free to open a PR.

> I uploaded a new version addressing this correctly (🤞)

Looks fine



## Comment by @dakk

Ok, I was missing this piece, now I also remove unused sibling and I think I'm ready to handle these situations correctly. Thank you for the help davxy


## Comment by @davxy

Just in case: the predictable behavior that I've described applies only to blocks generated by the fuzzer. In a real-world scenario, you must be prepared to receive a block on top of any other block that comes after the last finalized one. The behavior outlined above reflects how the fuzzer constructs the chain, which is intentionally simplified for M1.


## Comment by @dakk

@davxy  Docker release is available at `ghcr.io/dakk/jampy-target:0.7.2`


## Comment by @dakk

and I also updated parameters to match the proposed set
