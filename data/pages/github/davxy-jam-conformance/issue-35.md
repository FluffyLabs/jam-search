---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/35'
title: TSJam
site: github.com/davxy/jam-conformance
created_at: '2025-08-27T15:48:00.000Z'
last_modified: '2025-08-27T15:48:00.000Z'
---

# TSJam

## Issue by @vekexasia

Hello @davxy :)

I finally published the first version of hte fuzzer targeting 0.7.0. you can find the latest version in this repository 
https://github.com/vekexasia/tsjam-releases

There is a readme but for your convenience you can run it **without any argument** but it requires the `JAM_CONSTANTS` env variable set to `tiny` (by default it runs full).

Thanks




## Comment by @davxy

how can I pass the socket file name?


## Comment by @vekexasia

> how can I pass the socket file name?

hey i just added a new deliverable to specify `--socket` 


## Comment by @davxy

Hi @vekexasia  , I just cloned your repo. 

I’ve noticed a couple of issues so far, mostly related to the release process, which isn’t fully compatible with our scripts/workflow.

---

### LFS

```bash
❯ cat jam-fuzzer-target-v0.7.0.1-proto0.7.0
version https://git-lfs.github.com/spec/v1
oid sha256:ffa3b3d808f693e84ab3e1a99b9fc029e1e4a720de3237474292b3e50b1d6179
size 124817031
```

Would it be possible to publish the actual binary instead of the LFS pointer?  

Additionally, we need an easily automated way to fetch the latest binary (ideally not tied to a specific version, or at least only to the GP version) so I can download it with a script without having to update the version each time a new release is made.


---

### Fails to start

I installed `git lfs` anyway, and downloaded the actual binary.

I tried to start it but I get the following error:

```bash
❯ ./jam-fuzzer-target-v0.7.0.1-proto0.7.0
node:internal/modules/package_json_reader:255
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@tsjam/codec' imported from /mnt/ssd/develop/jam/jam-conformance/scripts/targets/jamts/2aabca5/dist/cli.mjs
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:255:9)
    at packageResolve (node:internal/modules/esm/resolve:767:81)
    at moduleResolve (node:internal/modules/esm/resolve:853:18)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:783:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:707:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:690:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:307:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:183:49) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.18.0
```

Since we have more and more targets to test, I need a standalone binary that runs without requiring any dependencies on my workstation. If that is not possible (for example, due to TypeScript -  I'm not an expert), you could consider providing a possibly lightweight Docker image, as other teams are already doing.






## Comment by @vekexasia

Hello,

I've released it through github releases. . I guess you already have it but you can use a simple script to download the latest release.

the archive contains all the required node_modules and the binary to be launched. I hope that is fine. 

Filenames inside the archive are constants so i guess that allows it to be scriptable for you


## Comment by @vekexasia

hello @davxy I just released a new version. I am not sure if you have an automatic check on your side about releases. 

I am updating the very same release every time with a new binary. Let me know if you prefer a new release each time...

I am asking cause I think i had arelease slightly before you publishing the last reports which fixed some of the traces but it seems it did not make in the commit 3a1040c1c626a9739033439cf2c3402ebff674cf

tkz


## Comment by @davxy

I just ran your latest version, but all the traces are still failing. Could you clarify what this version is supposed to address?


## Comment by @vekexasia

hey davxy it should fix all i just run it and all are ok can you check the peerinfo? it should also spit part of the commit hash

{
  name: 'tsjam-0.7.0-tiny-17c1e820',
  app_version: { major: 0, minor: 7, patch: 0 },
  jam_version: { major: 0, minor: 7, patch: 0 }
}


## Comment by @davxy

```
❯ ./target.sh run tsjam
Action: run, Target: tsjam, OS: linux
Run tsjam on targets/tsjam/latest
Waiting for target termination (pid=214054)
Listening on /tmp/jam_target.sock
constant mode tiny
{
  name: 'tsjam-0.7.0-tiny-17c1e820',
  app_version: { major: 0, minor: 7, patch: 0 },
  jam_version: { major: 0, minor: 7, patch: 0 }
}
```

But:

🔴 1756548459
🔴 1756548583
🔴 1756548667
🔴 1756548706
🔴 1756548741
🔴 1756548767
🔴 1756548796
🔴 1756548916
🔴 1756572122

All the traces are failing



## Comment by @vekexasia

that's interesting as i can have them pass can you share the output of one of those (from target point of view).

-- i wonder if there are some checks i should be turning off. For Example to run them locally i send header from block X withsetState in the protocol and then send block X+1 then compare.

But in order to have them pass i need to turn off 11.35 the lookup header check  


## Comment by @vekexasia

Also can you try to set another env variable (no need to update binary) `RUNNING_TRACE_TESTS = "true"`


## Comment by @vekexasia

Hey @davxy I released another version after having found a discussion about 11.35 https://github.com/davxy/jam-conformance/issues/8#issuecomment-3201769214 .

the release now has 11.35 disabled by default. Sorry for not having noticed that before. 

I saw you've been working https://github.com/davxy/jam-conformance/pull/47 so 11.35 is going to handled soon in the fuzzer. but i'd like to see if there are any other issues with my target 




## Comment by @vekexasia

hey @davxy last merged table shows tsjam crahing/failing at 1756791458 but it should no longer be the case since last release of yesterday 3PM GMT+2.

It was a problem  on abusing `.unwrap()` in rust but that should be solved. Just to make sure i did rebuild the package from scratch if you could try... thank you




## Comment by @davxy

```
❯ ./target.py run tsjam
Action: run, Target: tsjam, OS: linux
Running tsjam on docker image debian:stable-slim (command ./tsjam-fuzzer-target/jam-fuzzer-target --socket /tmp/jam_target.sock)
Waiting for target termination (pid=462011)
Listening on /tmp/jam_target.sock
constant mode tiny
{
  name: 'tsjam-0.7.0-tiny-6422e722',
  app_version: { major: 0, minor: 7, patch: 0 },
  jam_version: { major: 0, minor: 7, patch: 0 }
}
<- 18
received message PEER_INFO
-> 37
<- 177882
received message SET_STATE
-> 37
<- 309
received message IMPORT_BLOCK
-> 37
<- 309
received message IMPORT_BLOCK
node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^

AssertionError [ERR_ASSERTION]: State must be initialized before applying a block
    at o (file:///jam/tsjam-fuzzer-target/cli.mjs:1:249283)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: undefined,
  expected: true,
  operator: '=='
}

Node.js v22.18.0
Cleaning up Docker container tsjam...
```


## Comment by @vekexasia

fixed. thanks


## Comment by @vekexasia

hey @davxy my target should be up to spec with v1 | 6c58f4b1


## Comment by @vekexasia

hey davxy, new release. tsjam v0.7.1 https://github.com/vekexasia/tsjam-releases/releases/tag/0.7.1


## Comment by @vekexasia

hey, mine is 0.7.2 ready too https://github.com/vekexasia/tsjam-releases/releases/tag/0.7.2


## Comment by @davxy

Hey. After running a *"long"* session (~21K steps) your target terminated with the following failure.

```
<--- Last few GCs --->

[7:0x56293ccfc000]  4034628 ms: Scavenge (interleaved) 1688.2 (1767.3) -> 1688.3 (1767.3) MB, pooled: 8 MB, 2.09 / 0.00 ms  (average mu = 0.340, current mu = 0.334) external memory pressure; 
[7:0x56293ccfc000]  4035159 ms: Mark-Compact 1688.3 (1767.3) -> 1688.3 (1768.8) MB, pooled: 6 MB, 379.28 / 0.00 ms  (+ 151.2 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 539 ms) (average mu = 0.330, current mu

<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
----- Native stack trace -----

 1: 0x5628ffa193e8 node::OOMErrorHandler(char const*, v8::OOMDetails const&) [./tsjam-fuzzer-target/jam-fuzzer-target]
 2: 0x5628ffe21d94 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [./tsjam-fuzzer-target/jam-fuzzer-target]
 3: 0x5628ffe22164 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [./tsjam-fuzzer-target/jam-fuzzer-target]
 4: 0x562900077beb  [./tsjam-fuzzer-target/jam-fuzzer-target]
 5: 0x562900077c15  [./tsjam-fuzzer-target/jam-fuzzer-target]
 6: 0x56290009183a  [./tsjam-fuzzer-target/jam-fuzzer-target]
 7: 0x562900094cdc  [./tsjam-fuzzer-target/jam-fuzzer-target]
 8: 0x56290097b627  [./tsjam-fuzzer-target/jam-fuzzer-target]
```

This issue doesn't seem related to the STF step and may only be reproducible by replaying the full trace.  
I currently keep only the latest 1K steps, which - when replayed - don't trigger the failure.  

Since 1K steps take ~3.7 GB, the full trace would be ~77 GB - far too large to share directly. Sharing via a remote folder could be an option, but I'm not pursuing that; perhaps W3F auditors have the necessary resources.  

Alternatively, based on the log, could you identify the root cause? It looks like there might be a heap leak.



## Comment by @davxy

Looks like the `--socket` CLI argument is ignored? 

For example

```bash
./tsjam-fuzzer-target/jam-fuzzer-target --socket /tmp/foobar.sock
```

doesn't create the `/tmp/foobar.sock`, but it creates `/tmp/jam_target.sock`



## Comment by @vekexasia

Sorry @davxy my bad. I introduced a regression and didnt properly forward args. It is fixed now.
