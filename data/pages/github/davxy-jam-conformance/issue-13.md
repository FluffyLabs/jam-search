---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/13'
title: SpaceJam
site: github.com/davxy/jam-conformance
created_at: '2025-08-13T05:13:15.000Z'
last_modified: '2025-08-13T05:13:15.000Z'
---

# SpaceJam

## Issue by @clearloop

## SpaceJam Fuzzing

| release | date | description |
| - | - | - |
| [all][all] | . | The releases page of spacejam binaries |
| [0.6.7][latest]  | 2025-08-13 | the latest spacejam release matched v0.6.7 |

for shortcut of downloading the latest `spacejam` binary  (`2025-08-13`)

```bash
curl -fsSL https://sh.spacejam.dev | sh
```

### Usage

```bash
# running a fuzz target
spacejam fuzz target -v 

# running a fuzzer
spacejam fuzz fuzzer -t jam-test-vectors/traces/storage -v

# running a single trace
spacejam fuzz tx trace.json -v
```

Note that `RUST_LOG` is available, feel free to request new logs for `spacejam` which helps debugging !

### Known Issues

- [ ] invocations out of storage and preimages are not tested


[latest]: https://github.com/spacejamapp/specjam/releases/tag/0.6.7
[all]: https://github.com/spacejamapp/specjam/releases


## Comment by @clearloop

sorry for breaking in [#11](https://github.com/davxy/jam-conformance/issues/11#issuecomment-3175962034)! I was testing our fuzzer format with duna's target and tried their reports then commented on the issue unconsciously, I'm trying others' reports since I want to confirm if our binary is ready enough first

for the current status, we are still working on fixing the traces in other teams' reports

- https://github.com/spacejamapp/specjam/issues/11
- https://github.com/spacejamapp/specjam/issues/12
- https://github.com/spacejamapp/specjam/issues/13
- https://github.com/spacejamapp/specjam/issues/14


## Comment by @davxy

> sorry for breaking in https://github.com/davxy/jam-conformance/issues/11#issuecomment-3175962034! I was testing our fuzzer format with duna's target and tried their reports then commented on the issue unconsciously, I'm trying others' reports since I want to confirm if our binary is ready enough first

No problem

I tried running your target and encountered a failure on your side, apparently related to the order of the assurances, which should be sorted by val index.

```log
❯ ./spacejam fuzz target -vvv
2025-08-13 13:03:12  INFO spacejam::fuzz::target: Listening on "/tmp/jam_target.sock"
2025-08-13 13:03:18 DEBUG  read: spacejam::fuzz: message(length): Info
2025-08-13 13:03:18 DEBUG write: spacejam::fuzz: message(16): Info
2025-08-13 13:03:18 DEBUG  read: spacejam::fuzz: message(length): SetState(len=21)
2025-08-13 13:03:18 DEBUG write: spacejam::fuzz: message(33): StateRoot(0xc2d2a5bf305862ae66218e62bf8d1398388850b95bf62b0c9d30269583399dec)
2025-08-13 13:03:18 DEBUG  read: spacejam::fuzz: message(length): ImportBlock(slot=1, hash=0x8a2c121136c29f2bf588a9f29aad83ba0fb3f64f5e8475e933617bb8591875b7)
2025-08-13 13:03:18 DEBUG write: spacejam::fuzz: message(33): StateRoot(0x5692d3a3929e0e8390e80dcfa838e95f26f72b7f4accd65fa57c1ed6a1e7a9cb)
2025-08-13 13:03:18 DEBUG  read: spacejam::fuzz: message(length): ImportBlock(slot=2, hash=0x3f3fd732f6ba3bee0f533fc13575a0071ed14685bcaa6c18dc9cb65c2e0be050)
2025-08-13 13:03:18 ERROR spacejam::cmd: NotSortedOrUniqueAssurers
```

As a side note, if the block you receive is invalid - which is *not* the case for `0x3f3fd732f6ba3bee0f533fc13575a0071ed14685bcaa6c18dc9cb65c2e0be050`
but could happen if the fuzzer intentionally sends an incorrect mutation to check behavior  - you should
not terminate the target. Instead, simply send back the state root for the last correcly importe block and wait for the next block (which should have the same parent of the incorrect one).

Here is the trace for you to reproduce: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/spacejam/1755083543

Edit: If the block is invalid, send back the state root for the last correcly imported block and wait for the next (I added a note about this here:
https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#message-flow)



## Comment by @clearloop

We just released [SpaceJam 0.6.7-pre.2](https://github.com/spacejamapp/specjam/releases/tag/0.6.7-pre.2) with fixes

```
curl -fsSL https://sh.spacejam.dev | sh
```

## Failed archive tests

### ~~1. Privileges mismatched, host call `bless` from [1754988078/00000010][zig-10]~~


```
...

DEBUG program: Decoded instruction: Bless { manager: 0, assign: 0, designate: 324788131, auto_acc: [] } target="boot"

...

ERROR keyval mismatch: Privileges: 0x0c000000000000000000000000000000000000000000000000000000000000
DEBUG polkajam: Privileges { bless: 0, designate: 0, assign: [0, 324788131], always_acc: {} }
DEBUG spacejam: Privileges { bless: 0, designate: 324788131, assign: [0, 0], always_acc: {} }

...
```

SpaceJam correctly applied the decoded bess instruction however the result in polkajam got some offset

### 2. Guarantee signature verification failed from [1754725568/00000003][java-03]

The report is at the same slot as the block, however using current validators from pre-state can not verify the guarantee signatures


[java-03]: https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/archive/0.6.7/1754725568/00000003.json
[zig-10]: https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/archive/0.6.7/1754988078/00000010.json


## Comment by @davxy

I tried to fuzz your target and at some point It logs this:

```
❯ ./run_target.sh spacejam
Run spacejam on targets/spacejam/0.6.7-pre.2
2025-08-14 16:43:43  INFO Listening on "/tmp/jam_target.sock"
Waiting for target termination (pid=292766)
2025-08-14 16:43:47  INFO No more bytes from the stream(failed to fill whole buffer)! average transit time for 2 blocks: 42ms
2025-08-14 16:47:16  WARN failed to process message: DependencyMissing, waiting for the next message ...
2025-08-14 16:47:20  INFO No more bytes from the stream(failed to fill whole buffer)! average transit time for 13 blocks: 65ms
```

But it doesn't send back the last successfully imported block state root.

I added this note here: https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#message-flow

---

FYI I created the [NEWS](https://github.com/davxy/jam-conformance/blob/main/NEWS.md) page. Please keep an eye on it


## Comment by @clearloop

thanks! it is caused by failing on importing blocks, SpaceJam got into stale state and trying to wait for the next message, will get it fixed tmr, I believe with the trace flag it will log everything

```
RUST_LOG=trace ./run_target.sh spacejam
```

btw if it is possible sharing some insights on my [two failing archive tests](https://github.com/davxy/jam-conformance/issues/13#issuecomment-3187497189), for 1. I have been stuck in it for two days, a PVM trace would be super helpful!


## Comment by @davxy

New report for you: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/spacejam/1755183715

> so if failing on importing blocks, shall I return the state root anyway?

Yes. Always **return the state root of the last successfully imported block**. Some blocks will be intentionally invalid; in those cases, returning the previous state root implicitly signals that the block was not imported, and you then wait for the next block. In short, the protocol is the same as for a successful import, except you return the previous state root instead of a new one.

> btw if it is possible sharing some insights on my https://github.com/davxy/jam-conformance/issues/13#issuecomment-3187497189, for 1. I have been stuck in it for two days, a PVM trace will be super helpful!

I'll have a look


## Comment by @clearloop

Just released `SpaceJam-v0.0.3` at [spacejamapp/specjam@0.6.7-pre.3](https://github.com/spacejamapp/specjam/releases/tag/0.6.7-pre.3)

- [x] now can pass all archive tests except 1754982087_00000005
- [x] the state root response of failure block importing is fixed 

according to [NEWs](https://github.com/davxy/jam-conformance/blob/main/NEWS.md) will keep our implementation up to date from the repo updates



## Comment by @clearloop

hi @davxy, we just released `SpaceJam-v0.0.4` at [spacejamapp/specjam@0.6.7-pre.4](https://github.com/spacejamapp/specjam/releases/tag/0.6.7-pre-4), the crash is now fixed ... 

we can now pass all traces except two that I think they are not compatible with other traces

| Test | Reason |
| - | - |
| [1754982087][0] | this test **should get retired** because it's not using compact encoding for generating service ids, if align our id generator to this test, at least 2 other traces will get broken |
| [1755530300][1] | I propose to **delay the accumulate root integration to `0.7.0`**, because if we support this, all other traces including the test vectors will get broken |


also, I noticed tests related to host call new require parent services getting acc_gas charged by the input acc_gas for the newly created service, if I'm not mistaken, this is currently an undefined behavior in GP


[0]: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/traces/1754982087
[1]: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/traces/1755530300


## Comment by @clearloop

just released [spacejamapp/specjam@0.6.7-pre.5](https://github.com/spacejamapp/specjam/releases/tag/0.6.7-pre-5) which removed the extra gas charging raised by pvm tests


## Comment by @clearloop

SpaceJam binaries for 0.7.0  [spacejamapp/specjam@0.7.0](https://github.com/spacejamapp/specjam/releases/tag/0.7.0)


## Comment by @clearloop

hi @davxy , just made some optimizations for the performance! see [spacejamapp/specjam@0.7.0-pre.1](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.1)

please do without `-vv`  ^ ^


## Comment by @davxy

```bash
❯ ./spacejam
fish: Job 1, './spacejam' terminated by signal SIGILL (Illegal instruction)
```


## Comment by @clearloop

> ❯ ./spacejam
> fish: Job 1, './spacejam' terminated by signal SIGILL (Illegal instruction)

sorry it was caused by a overhead optimization that using `native-cpu`, now fixed at [spacejamapp/specjam@0.7.0-pre.2](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.2), should be 4x faster on pvm execution and 1.2x faster on processing normal transitions


## Comment by @clearloop

[spacejamapp/specjam@0.7.0-pre.3](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.3) 2x-5x optimized in runtime logic 🚀


## Comment by @clearloop

[spacejam@0.7.0-pre.4](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.4) should be able to pass all current fuzz for 0.7.0 now


## Comment by @clearloop

[spacejam@0.7.0-pre.5](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.5) should be able to pass all traces in #52

the header validation logic was previously at a different level in our implementation, just integrated it into the fuzzer!

btw our compiler is supported in the fuzzer as well now, could be enabled via `--compiler` flag of the command `fuzz target`
for fun since it's currently 2x slower than my interpreter : /, will make it the default strategy once it can reach the speed of our interpreter!


## Comment by @davxy

I see 1756792661 failing.
I also added a new report from safrole test vectors 1756832925


## Comment by @clearloop

[spacejam@0.7.0-pre.6](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.6)

oh sorry, I didn't maintain a chain in my fuzzer so sort of cache got invalid, just did some workaround for adapting linear block importing for patching new epoch in safrole, it works for all of the safrole tests and the current fuzz tests now

the case I'm not handling in the fuzzer target atm is that missing sort of blocks on the finalized chain that I don't have enough tickets to re-calculate the ticket mark, but likely we will not have this case in current fuzz protocol, bcz it requires us routing to the missing blocks from the fuzzer?




## Comment by @clearloop

I don't get why we still have problems in `1756792661` in the [table](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports#gp-070), it works locally in tests and with our fuzzer, in case the binaries are not up to date, I just refreshed the binaries in [spacejam@0.7.0-pre.6](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.6)


## Comment by @clearloop

[spacejam@0.7.0-pre.7](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.7) fixed all traces


## Comment by @clearloop

interesting, could not reproduce `1756548583`, `1756548706 `, `1756548741 ` and `1756548916 ` from the [table](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports#gp-070), everything works locally, could you please re-confirm if SpaceJam got error on them @davxy ?


## Comment by @davxy

It seems like your target has become somewhat non-deterministic.

Some observations:

- When I run the traces individually, they all pass. But if I run them sequentially (i.e. without restarting the target between traces), some of them fail.

- Occasionally, it panics with the following error:

```
thread 'tokio-runtime-worker' panicked at /Users/clearloop/code/spacejam/crates/pvm/src/host/general.rs:143:39:
slice index starts at 92 but ends at 4
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```




## Comment by @clearloop

thanks for the details! just updated the binaries at [spacejam@0.7.0-pre.7](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.7), tested with storage traces sequentially!


## Comment by @clearloop

I have checked that we can pass `1756572122` locally, yes, also confirmed pinning the target, importing sequence of blocks  still works, could you please provide the details about why `1756572122` is broken on your side @davxy ? or I have no ideas how to "fix" it 🙏


## Comment by @clearloop

GM @davxy , just released [spacejam-0.7.0-pre.8](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.8)

**1. adapted fuzzer v1 at #47**

my implementation of the jam codec haven't supported non-sequential `enum` (the error variant 255) yet, but I made a workaround for it, hope it works, all other messages can pass the codec of `examples/v1`

**2. all addressed traces should be resolved now**

still no clue about `1756572122`, after supporting sequential importing in my local testing system, I can still pass this trace, hope the `Error` message could help if it still fails at remote

**3. our recompiler is now alive**

now the default VM execution strategy is using the recompiler (linux-only), for fallback to the interpreter, go with the `--interp` flag in the command <kbd>target</kbd>

Cheers!


## Comment by @davxy

Your target now only works when I run outside of a docker container? 
For various reasons I run targets on docker

```sh
❯ ./target.py run --docker spacejam
Action: run, Target: spacejam, OS: linux
Running spacejam on docker image debian:stable-slim (command ./spacejam fuzz target /tmp/jam_target.sock)
Waiting for target termination (pid=297686)

thread 'tokio-runtime-worker' panicked at /Users/clearloop/code/spacejam/crates/pvm/spacevm/src/lib.rs:95:10:
fix me later: Permission denied (os error 13)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

thread 'tokio-runtime-worker' panicked at /Users/clearloop/code/spacejam/crates/pvm/spacevm/src/lib.rs:95:10:
fix me later: Permission denied (os error 13)

thread 'tokio-runtime-worker' panicked at /Users/clearloop/code/spacejam/crates/pvm/spacevm/src/lib.rs:95:10:
fix me later: Permission denied (os error 13)
```


## Comment by @clearloop

I just updated [spacejam-0.7.0-pre.8](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.8):

- detailed error message for the no permission case
- support specified cache dir


```
$ ./target/release/spacejam fuzz target -h
Fuzz with local unix socket

Usage: spacejam fuzz target [OPTIONS] [SOCKET]

Arguments:
  [SOCKET]  The path to the unix socket [default: /tmp/jam_target.sock]

Options:
  -c, --cache <CACHE>  The directory for the compilation cache
  -i, --interp         If use interpreter instead
  -v...                The verbosity level (repeat for more verbosity)
  -n, --noansi         Disable ANSI colors
  -h, --help           Print help
```

perhaps specify `--cache ./` can avoid adding more flags to the general docker script, please let me know that if disabling the cache would be proper for the current stage (it requires more work since the cache plays an important role in my recompiler)

note that if using the interpreter mode, there will be no cache at all, but it would be a pity since I'm working hard these two weeks to introduce the recompiler XD

---

oh there is compilation cache in `${APP_DATA}/spacejam` on linux it should be under `~/.local/share/spacejam`, I'll add an error handler for this `fix me later` anyway ...

if it is possible to use disk cache in your environment? I can refactor to make it disabled by default anyway, or a flag to specify the cache-dir that makes it easier to manage


## Comment by @davxy

Fixed: https://github.com/davxy/jam-conformance/commit/7bc92183d2745ab2fde9791e5bbcbbaa5e11c968

Was sufficient to set HOME env var


## Comment by @clearloop

hi @davxy , just introduced [spacejam-0.7.0.pre.9](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.9)

- tested against `minifuzzer`
- all failures in the two tables should be resolved now


## Comment by @clearloop

hi @davxy , just updated my binaries in the same release [spacejam-0.7.0.pre.9](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.9), 

- all `fork`/`no_fork`/`faulty` are tested
- verified that we can pass all traces in the table again, not sure about if the current failures of `spacejam` in the table are triggered by my previous incorrect fork setup in the fuzzer target which has also been fixed in the latest binaries (our unit tests have different setup comparing with the fuzzer so this could be the reason that why I didn't realize them before)


## Comment by @davxy

I'm observing a bit of non determinism my side. 

Examples:
- If I execute `1756572122` first it passes, but if I execute all the other sessions in the folders that come first (in order) then it always fail.
- On some runs the some other traces pass on some other runs they fails. 

---

More examples. 

Very first run (just downloaded)

```
🟢 1756548459
...
🟢 1756548796
🔴 1756572122
🟢 1756790723
...
🟢 1757406558
🔴 1757406598
🟢 1757421101
...
🟢 1757423102
🔴 1757423195
🟢 1757423271
...
🟢 1757862207
🔴 1757862468
🔴 1757862472
🟢 1757862743
```

Without stopping/restarting space jam I re-execute the same sessions in order

```
🟢 1756548459
...
🟢 1756548796
🔴 1756572122
🟢 1756790723
...
🟢 1757406558
🔴 1757406598
🟢 1757421101
...
🟢 1757423102
🔴 1757423195
🟢 1757423271
...
🟢 1757423902
🔴 1757841566
🟢 1757842797
...
🟢 1757843735
🔴 1757861618
🟢 1757862207
🔴 1757862468
🔴 1757862472
🟢 1757862743
```

Another session

```
🟢 1756548459
...
🟢 1757406558
🔴 1757406598
🟢 1757421101
...
🟢 1757423102
🔴 1757423195
🟢 1757423271
...
🟢 1757862743
```

Another

```
🟢 1756548459
...
🟢 1756548796
🔴 1756572122
🟢 1756790723
...
🟢 1757406558
🔴 1757406598
🟢 1757421101
...
🟢 1757423102
🔴 1757423195
🟢 1757423271
...
🟢 1757862743
```

---

As you can see there is something fishy here. Perhaps you are caching something somewhere

NOTE: On each session:
- On the fuzzer side, I close the socket and reopen it.
- I send PeerInfo + SetState
Not sure if this matters your side


## Comment by @clearloop

I probably caught the problem, fixing now ...

---

thank you so much for the details! looks like they are caused by the ancient cache! could you please try to clean the cache manually and retry them again? (cache dir `~/.local/share/spacejam`)
- if it works, I'll patch my target cleaning the cache each time launching a new fuzz target
- if not
  - likely I have to solve the race of cache IO, which also means your machine is too fast bcz I have already double confirmed the compiled artifacts...
  - or sth broken in my memory management, hope will never step into this branch since I currently can not reproduce the problems on my machines




## Comment by @clearloop

things should work now, just updated the binaries at [spacejam-0.7.0.pre.9](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.9), I found that some programs among traces are sharing the same code_hash with different initial registers, which poisoned my compiled bytecode (previous treating the initial registers as constants, now dynamic)

---

**UPDATED:**  I just supported my fuzzer doing tests like your description, now I can reproduce the problem, fixing now ...

---

> If I execute 1756572122 first it passes, but if I execute all the other sessions in the folders that come first (in order) then it always fail.

just updated the binaries at [spacejam-0.7.0.pre.9](https://github.com/spacejamapp/specjam/releases/tag/0.7.0-pre.9)

likely mainly caused by sort of race in cache since sometimes `1756572122` works and sometimes not, however I failed to reproduce the case with both my linux/macOS machines, don't want to waste more time on this, so we now clean all cache on each new session > <

if it is possible to update our reports (with the error message feature in v1) of the old failures (if they still fail) btw in the next batch? I believe the error messages may help a lot as well




## Comment by @davxy

I updated the reports table and your report files that are still failing 


## Comment by @clearloop

Edited: all solved now

---

there are 3 cases I'm investigating now, especially [1763371498](https://github.com/davxy/jam-conformance/discussions/117), I think the designate and the bless services could be messed up in the trace generator

it could be related with the problem I'm struggling with today `1761654684` as well (I saw this is removed from my table, but it is actually still failing in my local env...), drawn validators got updated but the trace expects not, which can be explained by this as well

for `1763371127` and `1763371379`, would be helpful if there are `report.json` for the reason of failure imports


## Comment by @clearloop

updates:

- the latest version of `0.7.1` (fixed the remain tests) - [spacejam 0.7.1-pre.6](https://github.com/spacejamapp/specjam/releases/tag/0.7.1-pre.6)
- the version of `0.7.2` - [spacejam 0.7.2-pre.1](https://github.com/spacejamapp/specjam/releases/tag/0.7.2-pre.1)


## Comment by @davxy

Hey @clearloop your latest [0.7.2](https://github.com/spacejamapp/specjam/releases/tag/0.7.2) release doesn't contain a binary for amd64 (which is the one I need :)))


## Comment by @clearloop

> Hey [@clearloop](https://github.com/clearloop) your latest [0.7.2](https://github.com/spacejamapp/specjam/releases/tag/0.7.2) release doesn't contain a binary for amd64 (which is the one I need :)))

sry I missed it while updating my bundle script, just uploaded
