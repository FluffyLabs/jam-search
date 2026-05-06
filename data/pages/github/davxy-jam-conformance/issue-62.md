---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/62'
title: Gossamer-Jam
site: github.com/davxy/jam-conformance
created_at: '2025-09-05T13:33:40.000Z'
last_modified: '2025-09-05T13:33:40.000Z'
content_kind: issue
---

# Gossamer-Jam

## Issue by @aang114

This is the tracking issue for the Gossamer-Jam client by ChainSafe that was added in PR https://github.com/davxy/jam-conformance/pull/61.

The latest release of Gossamer-Jam currently adheres to GP 0.6.7 and passes all the official GP 0.6.7 test vectors.

**Testing Gossamer-Jam against a Fuzzer**

To test Gossamer-Jam ("target") against the [JAM protocol conformance testing tool](https://github.com/davxy/jam-stuff/blob/main/fuzz-proto/README.md) ("fuzzer"), run it using the `target` command:

```
Run the implementation as a target for the JAM protocol conformance testing tool ("fuzzer"). For more information: https://github.com/davxy/jam-stuff/blob/main/fuzz-proto.

Usage:
  go-jam target [flags]

Flags:
  -h, --help            help for target
  -s, --socket string   UNIX Domain Socket Address to connect to (default "/tmp/jam_target.sock")
```


## Comment by @davxy

Hi, I get this failure:

```
❯ ./target.sh run gossamer
Effective OS: linux
Action: run, Target: gossamer, OS: linux
Running gossamer on docker image debian:stable-slim (command ./gossamer-jam-tiny-linux-amd64 target --socket /tmp/jam_target.sock)
Waiting for target termination (pid=547512)
WARNING: Your kernel does not support OomKillDisable. OomKillDisable discarded.
2025/09/05 17:14:45 fuzzer_target.go:109: Starting target now...
2025/09/05 17:14:45 fuzzer_target.go:57: Setting up Connection with /tmp/jam_target.sock...
2025/09/05 17:16:16 fuzzer_target.go:76: Performing handshake...
2025/09/05 17:16:16 fuzzer_target.go:119: Handshake failed: expected target.Version{Major:0x0, Minor:0x6, Patch:0x6}, got target.Version{Major:0x0, Minor:0x6, Patch:0x7}
2025/09/05 17:16:16 fuzzer_target.go:131: Quitting Target now...
2025/09/05 17:16:16 target.go:42: Target quit due to an unresolvable error. Shutting down...
2025/09/05 17:16:16 target.go:49: Goodbye!
```

Looks like you're expecting v0.6.6


## Comment by @aang114

Apologies. I have just updated the latest release: https://github.com/ChainSafe/gossamer-jam-releases/releases. Thanks


## Comment by @davxy

Hi, I now get two error categories (I haven't tried all the traces, just the first two in our jam-conformance traces archive)

### 1754982630

```
❯ ./target.sh run gossamer
Action: run, Target: gossamer, OS: linux
Running gossamer on docker image debian:stable-slim (command ./gossamer-jam-tiny-linux-amd64 target --socket /tmp/jam_target.sock)
Waiting for target termination (pid=181309)
2025/09/08 06:54:49 fuzzer_target.go:110: Starting target (GP 0.6.7 compliant) now...
2025/09/08 06:54:49 fuzzer_target.go:58: Setting up Connection with /tmp/jam_target.sock...
2025/09/08 06:54:57 fuzzer_target.go:77: Performing handshake...
2025/09/08 06:54:57 fuzzer_target.go:104: ✅ Handshake successful with /tmp/jam_target.sock!
2025/09/08 06:54:57 fuzzer_target.go:148: Starting Read Loop...
2025/09/08 06:54:57 fuzzer_target.go:157: [readLoop] message's payload prefix: 2
2025/09/08 06:54:57 fuzzer_target.go:169: [readLoop] Quitting target due to error: service (id 564523414) was not deserialized
2025/09/08 06:54:57 fuzzer_target.go:132: Quitting Target now...
2025/09/08 06:54:57 target.go:42: Target quit due to an unresolvable error. Shutting down...
2025/09/08 06:54:57 target.go:49: Goodbye!
Cleaning up Docker container ...
```

### 1754983524

```
❯ ./target.sh run gossamer
Action: run, Target: gossamer, OS: linux
Running gossamer on docker image debian:stable-slim (command ./gossamer-jam-tiny-linux-amd64 target --socket /tmp/jam_target.sock)
Waiting for target termination (pid=182425)
2025/09/08 06:56:30 fuzzer_target.go:110: Starting target (GP 0.6.7 compliant) now...
2025/09/08 06:56:30 fuzzer_target.go:58: Setting up Connection with /tmp/jam_target.sock...
2025/09/08 06:56:40 fuzzer_target.go:77: Performing handshake...
2025/09/08 06:56:40 fuzzer_target.go:104: ✅ Handshake successful with /tmp/jam_target.sock!
2025/09/08 06:56:40 fuzzer_target.go:148: Starting Read Loop...
2025/09/08 06:56:40 fuzzer_target.go:157: [readLoop] message's payload prefix: 2
2025/09/08 06:56:40 fuzzer_target.go:192: 🧮 Calculated state-root for SetState message: 0x307863326432613562663330353836326165363632313865363262663864313339383338383835306239356266363262306339643330323639353833333939646563
2025/09/08 06:56:40 fuzzer_target.go:157: [readLoop] message's payload prefix: 1

thread '<unnamed>' panicked at src/context.rs:71:46:
called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
fatal runtime error: failed to initiate panic, error 5, aborting
SIGABRT: abort
PC=0x7f9f3e88e95c m=3 sigcode=18446744073709551610
signal arrived during cgo execution

goroutine 35 gp=0xc000103c00 m=3 mp=0xc00009d008 [syscall]:
runtime.cgocall(0x9dc7c0, 0xc000376be0)
        runtime/cgocall.go:167 +0x4b fp=0xc000376bb8 sp=0xc000376b80 pc=0x48898b
github.com/ChainSafe/go-jam/ffi/cgo._Cfunc_new_ring_ctx_from_srs(0x6, 0x7f9ee8000cb0)
        _cgo_gotypes.go:160 +0x47 fp=0xc000376be0 sp=0xc000376bb8 pc=0x8d6527
github.com/ChainSafe/go-jam/ffi/cgo.RingContextFromSrsPath(0x6, {0xca9232?, 0xc000103c00?})
        github.com/ChainSafe/go-jam/ffi/cgo/context.go:18 +0x38 fp=0xc000376c08 sp=0xc000376be0 pc=0x8d6a18
github.com/ChainSafe/go-jam/ffi.CreateRingContextFromSrs(...)
        github.com/ChainSafe/go-jam/ffi/vrfs.go:43
github.com/ChainSafe/go-jam/fuzzer-target.(*Target).handleImportBlockPayload(0xc0002d4008, 0xc0003a6200)
        github.com/ChainSafe/go-jam/fuzzer-target/fuzzer_target.go:215 +0x73 fp=0xc000379e18 sp=0xc000376c08 pc=0x972593
github.com/ChainSafe/go-jam/fuzzer-target.(*Target).readLoop(0xc0002d4008)
        github.com/ChainSafe/go-jam/fuzzer-target/fuzzer_target.go:162 +0x235 fp=0xc000379f00 sp=0xc000379e18 pc=0x971e35
github.com/ChainSafe/go-jam/fuzzer-target.(*Target).Start(0xc0002d4008)
        github.com/ChainSafe/go-jam/fuzzer-target/fuzzer_target.go:125 +0x2ac fp=0xc000379fc8 sp=0xc000379f00 pc=0x97188c
github.com/ChainSafe/go-jam/cmd.handleTargetCmd.gowrap1()
        github.com/ChainSafe/go-jam/cmd/target.go:32 +0x25 fp=0xc000379fe0 sp=0xc000379fc8 pc=0x977745
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc000379fe8 sp=0xc000379fe0 pc=0x493021
created by github.com/ChainSafe/go-jam/cmd.handleTargetCmd in goroutine 1
        github.com/ChainSafe/go-jam/cmd/target.go:32 +0x1fb

goroutine 1 gp=0xc000002380 m=nil [select]:
runtime.gopark(0xc000239c08?, 0x2?, 0x8?, 0x71?, 0xc000239b60?)
        runtime/proc.go:460 +0xce fp=0xc0002399e8 sp=0xc0002399c8 pc=0x48bb6e
runtime.selectgo(0xc000239c08, 0xc000239b5c, 0xc000284600?, 0x0, 0x3?, 0x1)
        runtime/select.go:351 +0x8b7 fp=0xc000239b28 sp=0xc0002399e8 pc=0x46a397
github.com/ChainSafe/go-jam/cmd.handleTargetCmd(0xc000239b88?, {0x0?, 0x0?, 0x0?})
        github.com/ChainSafe/go-jam/cmd/target.go:40 +0x2e9 fp=0xc000239c60 sp=0xc000239b28 pc=0x9773e9
github.com/ChainSafe/go-jam/cmd.init.func2(0xc0002be200?, {0xc00028c740?, 0x4?, 0xc89896?})
        github.com/ChainSafe/go-jam/cmd/target.go:19 +0x18 fp=0xc000239c90 sp=0xc000239c60 pc=0x9755f8
github.com/spf13/cobra.(*Command).execute(0x12d5280, {0xc00028c700, 0x2, 0x2})
        github.com/spf13/cobra@v1.9.1/command.go:1019 +0xae7 fp=0xc000239e38 sp=0xc000239c90 pc=0x6cf347
github.com/spf13/cobra.(*Command).ExecuteC(0x12d4d00)
        github.com/spf13/cobra@v1.9.1/command.go:1148 +0x465 fp=0xc000239f28 sp=0xc000239e38 pc=0x6cfca5
github.com/spf13/cobra.(*Command).Execute(...)
        github.com/spf13/cobra@v1.9.1/command.go:1071
github.com/ChainSafe/go-jam/cmd.Execute()
        github.com/ChainSafe/go-jam/cmd/root.go:22 +0x1a fp=0xc000239f40 sp=0xc000239f28 pc=0x9764da
main.main()
        github.com/ChainSafe/go-jam/main.go:13 +0xf fp=0xc000239f50 sp=0xc000239f40 pc=0x9778cf
runtime.main()
        runtime/proc.go:285 +0x29d fp=0xc000239fe0 sp=0xc000239f50 pc=0x45781d
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc000239fe8 sp=0xc000239fe0 pc=0x493021

goroutine 2 gp=0xc000002e00 m=nil [force gc (idle)]:
runtime.gopark(0x0?, 0x0?, 0x0?, 0x0?, 0x0?)
        runtime/proc.go:460 +0xce fp=0xc000096fa8 sp=0xc000096f88 pc=0x48bb6e
runtime.goparkunlock(...)
        runtime/proc.go:466
runtime.forcegchelper()
        runtime/proc.go:373 +0xb3 fp=0xc000096fe0 sp=0xc000096fa8 pc=0x457b53
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc000096fe8 sp=0xc000096fe0 pc=0x493021
created by runtime.init.7 in goroutine 1
        runtime/proc.go:361 +0x1a

goroutine 3 gp=0xc000003340 m=nil [GC sweep wait]:
runtime.gopark(0x0?, 0x0?, 0x0?, 0x0?, 0x0?)
        runtime/proc.go:460 +0xce fp=0xc000097780 sp=0xc000097760 pc=0x48bb6e
runtime.goparkunlock(...)
        runtime/proc.go:466
runtime.bgsweep(0xc000090080)
        runtime/mgcsweep.go:279 +0x94 fp=0xc0000977c8 sp=0xc000097780 pc=0x440834
runtime.gcenable.gowrap1()
        runtime/mgc.go:212 +0x25 fp=0xc0000977e0 sp=0xc0000977c8 pc=0x434865
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc0000977e8 sp=0xc0000977e0 pc=0x493021
created by runtime.gcenable in goroutine 1
        runtime/mgc.go:212 +0x66

goroutine 4 gp=0xc000003500 m=nil [GC scavenge wait]:
runtime.gopark(0xc000090080?, 0xe31ed0?, 0x1?, 0x0?, 0xc000003500?)
        runtime/proc.go:460 +0xce fp=0xc000097f78 sp=0xc000097f58 pc=0x48bb6e
runtime.goparkunlock(...)
        runtime/proc.go:466
runtime.(*scavengerState).park(0x134a620)
        runtime/mgcscavenge.go:425 +0x49 fp=0xc000097fa8 sp=0xc000097f78 pc=0x43e2e9
runtime.bgscavenge(0xc000090080)
        runtime/mgcscavenge.go:653 +0x3c fp=0xc000097fc8 sp=0xc000097fa8 pc=0x43e87c
runtime.gcenable.gowrap2()
        runtime/mgc.go:213 +0x25 fp=0xc000097fe0 sp=0xc000097fc8 pc=0x434805
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc000097fe8 sp=0xc000097fe0 pc=0x493021
created by runtime.gcenable in goroutine 1
        runtime/mgc.go:213 +0xa5

goroutine 18 gp=0xc000102700 m=nil [finalizer wait]:
runtime.gopark(0x466a95?, 0x42bce5?, 0xb8?, 0x1?, 0xc000002380?)
        runtime/proc.go:460 +0xce fp=0xc000096620 sp=0xc000096600 pc=0x48bb6e
runtime.runFinalizers()
        runtime/mfinal.go:210 +0x107 fp=0xc0000967e0 sp=0xc000096620 pc=0x433767
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc0000967e8 sp=0xc0000967e0 pc=0x493021
created by runtime.createfing in goroutine 1
        runtime/mfinal.go:172 +0x3d

goroutine 19 gp=0xc000103880 m=nil [cleanup wait]:
runtime.gopark(0x0?, 0x0?, 0x0?, 0x0?, 0x0?)
        runtime/proc.go:460 +0xce fp=0xc000092768 sp=0xc000092748 pc=0x48bb6e
runtime.goparkunlock(...)
        runtime/proc.go:466
runtime.(*cleanupQueue).dequeue(0x134aa00)
        runtime/mcleanup.go:439 +0xc5 fp=0xc0000927a0 sp=0xc000092768 pc=0x430465
runtime.runCleanups()
        runtime/mcleanup.go:635 +0x45 fp=0xc0000927e0 sp=0xc0000927a0 pc=0x430b25
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc0000927e8 sp=0xc0000927e0 pc=0x493021
created by runtime.(*cleanupQueue).createGs in goroutine 1
        runtime/mcleanup.go:589 +0xa5

goroutine 36 gp=0xc0002dc000 m=nil [select, locked to thread]:
runtime.gopark(0xc0002e27a8?, 0x2?, 0x0?, 0x0?, 0xc0002e2794?)
        runtime/proc.go:460 +0xce fp=0xc0002e2618 sp=0xc0002e25f8 pc=0x48bb6e
runtime.selectgo(0xc0002e27a8, 0xc0002e2790, 0x0?, 0x0, 0x0?, 0x1)
        runtime/select.go:351 +0x8b7 fp=0xc0002e2758 sp=0xc0002e2618 pc=0x46a397
runtime.ensureSigM.func1()
        runtime/signal_unix.go:1085 +0x194 fp=0xc0002e27e0 sp=0xc0002e2758 pc=0x486594
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc0002e27e8 sp=0xc0002e27e0 pc=0x493021
created by runtime.ensureSigM in goroutine 1
        runtime/signal_unix.go:1068 +0xc5

goroutine 37 gp=0xc0002dc1c0 m=4 mp=0xc00009d808 [syscall]:
runtime.notetsleepg(0x136c720, 0xffffffffffffffff)
        runtime/lock_futex.go:123 +0x29 fp=0xc0002e2fa0 sp=0xc0002e2f78 pc=0x429029
os/signal.signal_recv()
        runtime/sigqueue.go:152 +0x29 fp=0xc0002e2fc0 sp=0xc0002e2fa0 pc=0x48d549
os/signal.loop()
        os/signal/signal_unix.go:23 +0x13 fp=0xc0002e2fe0 sp=0xc0002e2fc0 pc=0x974f73
runtime.goexit({})
        runtime/asm_amd64.s:1693 +0x1 fp=0xc0002e2fe8 sp=0xc0002e2fe0 pc=0x493021
created by os/signal.Notify.func1.1 in goroutine 1
        os/signal/signal.go:152 +0x1f

goroutine 5 gp=0xc000003dc0 m=nil [select]:
```


## Comment by @aang114

> Hi, I now get two error categories (I haven't tried all the traces, just the first two in our jam-conformance traces archive)

Hi @davxy, I have updated the latest release: https://github.com/ChainSafe/gossamer-jam-releases/releases. It should be resolved now. Thanks


## Comment by @davxy

Hi, here are your reports for 0.6.7 traces

https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/reports/gossamer


Note: Please modify your target so that it automatically goes back to listening for new connections after a session ends. Otherwise, I have to restart it manually after each run, and my scripts assume that targets remain available continuously.



## Comment by @aang114

Hi @davxy, thanks for the reports for the 0.6.7 traces. 

We have just released our binary files for GP 0.7.0: https://github.com/ChainSafe/gossamer-jam-releases/releases **(Note: The fuzzer target currently adheres to fuzzer protocol v0)** and would love to find out about the performance information of our implementation. Thanks

P.S: I have also modified the fuzzer target to restart whenever a session ends, as you had suggested.


## Comment by @davxy

Hi @aang114  
The new benchmark sessions for 0.7.0 are now using protocol v1.  
It should be a small effort to implement (no need to add the fork feature for benchmarking).


## Comment by @aang114

> Hi [@aang114](https://github.com/aang114) The new benchmark sessions for 0.7.0 are now using protocol v1. It should be a small effort to implement (no need to add the fork feature for benchmarking).

HI @davxy, our fuzzer target has been updated to protocol v1 (without the forking feature): https://github.com/ChainSafe/gossamer-jam-releases/releases. We would love to find out about the performance metrics. Thanks :)


## Comment by @aang114

Hi @davxy, our fuzzer target now supports the forking feature and we have fixed all the failing traces except 1758621952, 1758621879, 1756791458 and 1757861618: https://github.com/ChainSafe/gossamer-jam-releases/releases/tag/v0.7.0.2. It would be great to see the updated results. Thanks 🙂 


## Comment by @aang114

Hi @davxy, we have just released our binary files for GP 0.7.1 (https://github.com/ChainSafe/gossamer-jam-releases/releases) and would love to know the updated results. Thanks :)


## Comment by @davxy

Perhaps you've not updated the jam-version string and checks

```
❯ ./target.py run gossamer
Action: run, Target: gossamer, OS: linux
Running gossamer on docker image
Command: ./gossamer-jam-tiny-linux-amd64 target --socket /tmp/jam_target.sock
Image: debian:stable-slim
Image ID: 7097a459326f
Created: 2025-08-11T00:00:00Z
Ensuring no leftover container with name gossamer...
Waiting for target termination (pid=62526)
2025/11/18 07:25:51 fuzzer_target.go:111: Starting fuzzer target (GP 0.7.0 compliant) now...
2025/11/18 07:25:51 fuzzer_target.go:54: Setting up Connection with /tmp/jam_target.sock...
2025/11/18 07:25:54 fuzzer_target.go:75: Performing handshake...
2025/11/18 07:25:54 fuzzer_target.go:121: Handshake failed: expected 0.7.0, got 0.7.1
2025/11/18 07:25:54 fuzzer_target.go:133: Quitting fuzzer target now...
2025/11/18 07:25:54 target.go:45: Fuzzer target quit due to an error. Restarting fuzzer target now...
2025/11/18 07:25:54 fuzzer_target.go:111: Starting fuzzer target (GP 0.7.0 compliant) now...
2025/11/18 07:25:54 fuzzer_target.go:54: Setting up Connection with /tmp/jam_target.sock...
```


## Comment by @aang114

> Perhaps you've not updated the jam-version string and checks

Apologies. I have just updated the latest release to fix this: https://github.com/ChainSafe/gossamer-jam-releases/releases. Thanks


## Comment by @aang114

Hi @davxy, we have just fixed all the failing traces for GP 0.7.1: https://github.com/ChainSafe/gossamer-jam-releases/releases. It would be great to see the updated results. Thanks 🙂


## Comment by @aang114

Hi @davxy, we just updated our fuzzer target to GP 0.7.2: https://github.com/ChainSafe/gossamer-jam-releases/releases. It would be great to see the results. Thanks


## Comment by @aang114

Hi @davxy, we have fixed all the failing traces for GP 0.7.2: https://github.com/ChainSafe/gossamer-jam-releases/releases. It would be great to see the updated results. Thanks


## Comment by @aang114

Hi @davxy, our fuzzer target now supports the ancestry feature: https://github.com/ChainSafe/gossamer-jam-releases/releases/tag/v0.7.2.2. It would be great to see the updated results. Thanks 🙂


## Comment by @davxy

Hi @aang114, our fuzzer does not currently support the ancestry feature yet, and this is not currently required for M1.

Please align your target with the standard packaging requirements:
https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#standard-target-packaging

Let me know once you have updated it to give it a try
