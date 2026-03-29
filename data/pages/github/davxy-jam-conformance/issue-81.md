---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/81'
title: Typeberry
site: github.com/davxy/jam-conformance
created_at: '2025-09-14T20:52:49.000Z'
last_modified: '2025-09-14T20:52:49.000Z'
---

# Typeberry

## Issue by @tomusdrw

This is a tracking issue for typeberry client (TypeScript) waiting to be added in #80.

- The current release (`0.0.2` / `latest`) supports both GP0.6.7 and GP0.7.0 (configurable via `GP_VERSION=0.6.7` or `GP_VERSION=0.7.0` (default) env flag).
- We also support V0 and V1 version of the fuzzer (`--version` option when running as `fuzz-target`).


## Comment by @davxy

@tomusdrw 

```
❯ ./target.py run typeberry
Action: run, Target: typeberry, OS: linux
Running typeberry on docker image ghcr.io/fluffylabs/typeberry:latest (command --version=1 fuzz-target /tmp/jam_target.sock)
Waiting for target termination (pid=10845)

> @typeberry/jam@0.0.2 start
> npm start -w @typeberry/jam -- --version=1 fuzz-target /tmp/jam_target.sock


> @typeberry/jam@0.0.2 start
> tsx ./index.ts --version=1 fuzz-target /tmp/jam_target.sock

INFO  [fuzztarget] 💨 Fuzzer V1 starting up.
LOG   [ext-ipc] IPC server is listening at /tmp/jam_target.sock
LOG   [ext-ipc] Client connected
LOG   [ext-ipc-fuzz-v1] [0] incoming message
INFO  [ext-ipc] Fuzzer PeerInfo {
  fuzzVersion: 1 (0x1)
  features: 2 (0x2)
  appVersion: Version {
    major: 0 (0x0)
    minor: 7 (0x7)
    patch: 0 (0x0)
  }
  jamVersion: Version {
    major: 0 (0x0)
    minor: 1 (0x1)
    patch: 25 (0x19)
  }
  name: fuzzer
} connected.
INFO  [ext-ipc-fuzz-v1] Handshake completed. Shared features: 0b10
LOG   [ext-ipc-fuzz-v1] Feature ancestry: false
LOG   [ext-ipc-fuzz-v1] Feature fork: true
LOG   [ext-ipc-fuzz-v1] [1] incoming message
using deprecated parameters for the initialization function; pass a single object instead
using deprecated parameters for the initialization function; pass a single object instead
INFO  [jam] 🫐 Typeberry 0.0.2. GP: 0.7.0 (w3f-davxy)
INFO  [jam] 🎸 Starting node: 257c5feef3c5.
INFO  [jam] 🛢 Opening database at /app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c
ERROR [ext-ipc-fuzz-v1] Error while processing fuzz v1 message: Error: Unable to open database at /app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c: Error: EACCES: permission denied, mkdir '/app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c'
ERROR [ext-ipc-fuzz-v1] Error: Unable to open database at /app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c: Error: EACCES: permission denied, mkdir '/app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c'
ERROR [ext-ipc-fuzz-v1] Error: Unable to open database at /app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c: Error: EACCES: permission denied, mkdir '/app/bin/jam/../.././database/fuzz/1820121740832/8506c831/067f9a7c'
    at openDatabase (/app/packages/jam/node/common.ts:53:11)
    at main (/app/packages/jam/node/main.ts:40:49)
    at async Object.resetState (/app/packages/jam/node/main-fuzz.ts:78:23)
    at async FuzzTarget.processAndRespond (/app/extensions/ipc/fuzz/v1/handler.ts:103:27)
    at async FuzzTarget.onSocketMessage (/app/extensions/ipc/fuzz/v1/handler.ts:62:7)
    at async <anonymous> (/app/extensions/ipc/server.ts:57:13)
LOG   [ext-ipc] Client disconnected
LOG   [ext-ipc-fuzz-v1] Closing the v1 handler. Reason: close.
```


## Comment by @tomusdrw

Ugh, sorry about that, I didn't notice that root is dropped in the `docker run`. We've released a new image that should fix that issue.


## Comment by @davxy

I'm still getting the same error 

Please, try run `minifuzz` (https://github.com/davxy/jam-conformance/pull/85) against your target first


## Comment by @tomusdrw

The image is updated, apologies again. It was working in my setup, because the host uid was matching the internal uid of docker image. Now the database folder should be writable for everyone.

I'm running `minifuzz` now, but it seems we're failing, so will debug a bit further. My first guess is that our fork support is not working correctly.


## Comment by @tomusdrw

Are all `minifuzz` examples expected to work correctly? The first 10 we can import smoothly, but then reaching an error that I find it quite hard to debug.
```
Processing pair 30: 00000029_fuzzer_import_block.bin -> 00000029_target_state_root.bin
TX: import_block
RX: state_root
Unexpected target response
--------------------------
Expected:
{
    "state_root": "0x44ae640ccf1d1a8e8f1f0e709b6a19da2cf0cfa9df79828a04f2624702509d2a"
}
---
Returned:
{
    "state_root": "0xe2af9989706289601d1cf008a4cd2e3891da4eeb632cee77c656af1971d5437c"
}
Connection closed
```

Is there any more details on the expected state somewhere? We do pass all of the `traces` found in the repository currently.


## Comment by @tomusdrw

> Are all `minifuzz` examples expected to work correctly? The first 10 we can import smoothly, but then reaching an error that I find it quite hard to debug.
> 
> ```
> Processing pair 30: 00000029_fuzzer_import_block.bin -> 00000029_target_state_root.bin
> TX: import_block
> RX: state_root
> Unexpected target response
> --------------------------
> Expected:
> {
>     "state_root": "0x44ae640ccf1d1a8e8f1f0e709b6a19da2cf0cfa9df79828a04f2624702509d2a"
> }
> ---
> Returned:
> {
>     "state_root": "0xe2af9989706289601d1cf008a4cd2e3891da4eeb632cee77c656af1971d5437c"
> }
> Connection closed
> ```
> 
> Is there any more details on the expected state somewhere? We do pass all of the `traces` found in the repository currently.

To answer myself: https://github.com/davxy/jam-conformance/tree/main/fuzz-proto/examples/v1#warning there is a bit fat warning about the state root being intentionally incorrect.


@davxy our latest version should finally have all the issues fixed. We also pass the `minifuzz` test.




## Comment by @davxy

It seems there is some non-determinism involved.  
Between sessions, we do not actually shut down your target , we just close and reopen the socket.  
Could it be that you are not flushing some cache?

E.g. this is one run:
```
🟢 1756548459
🟢 1756548583
🔴 1756548667
🟢 1756548706
🟢 1756548741
🟢 1756548767
🔴 1756548796
🟢 1756572122
```

This is another:
```
🟢 1756548459
🟢 1756548583
🟢 1756548667
🟢 1756548706
🟢 1756548741
🟢 1756548767
🔴 1756548796
🟢 1756572122
```

If you directly execute `1756548796` after a target restart:

```
🟢 1756548796
```


## Comment by @tomusdrw

That's interesting. Could you share a bit more light into what you is understood by "one run"?, i.e. in your first example: 
1. Fuzzer connects to the target (i.e. session starts)
2. Each trace number that you listed, starts with `Initialize` message
3. Then a bunch of `ImportBlock` messages is being sent (I assume more than what we have in that repo?)
4. When new trace number is present on the list it just means another `Initialize` message being sent.
5. Fuzzer disconnects (i.e. session ends).

Am I getting this right?

In our case, each `Initialize` message should actually start a fresh client instance and the DB should be wiped out (it's quite inefficient now, but should be safe). The fuzzer target with IPC is a separate process and should not share any state with the client instance, so it should not really matter whether session was opened/closed.

We'll double check what might be going wrong. Being able to reproduce the full scenario locally would help a lot, but if it's not possible, perhaps it would be possible to get a log from such run?


## Comment by @tomusdrw

Issue identified, I think I can easily reproduce that with `minifuzz`. Fix is on the way.


## Comment by @tomusdrw

The buggy behaviour is fixed now in `0.1.0` version.


## Comment by @davxy

A bit better, but looks like it terminates after few sessions. 
Message in your log:

```
Removing DB /app/bin/jam/../.././database/fuzz/1758301972058
INFO  [     jam] 🫐 Typeberry 0.1.0. GP: 0.7.0 (w3f-davxy)
INFO  [     jam] 🎸 Starting importer: cb1dc4728672.
INFO  [     jam] 🛢 Opening database at /app/bin/jam/../.././database/fuzz/1758301972058/128a0258/30cdd81a
LOG   [     jam] 🛢 Best header hash: 0x0000000000000000000000000000000000000000000000000000000000000000
LOG   [     jam] 🛢 Best state root: null
LOG   [     jam] 🛢 Database looks fresh. Initializing.
LOG   [     jam] 🧬 Writing genesis block #1809: 0x30cdd81a7758d42f30121694eec5ac1ff21d88e26a9a68cdb32a449139dfce8a
INFO  [     jam] 🧬 Genesis state root: 0x8d2d045dbec9bcecfa473db6a5129a447d23aefca0278f3c9506541a041dafd6
INFO  [importer] 😎 Best time slot: 1809 (header hash: 0x30cdd81a7758d42f30121694eec5ac1ff21d88e26a9a68cdb32a449139dfce8a)
LOG   [ext-ipc-fuzz-v1] [3] incoming message
LOG   [importer] 🧱 Attempting to import a new block
LOG   [importer] import:verify took 0.00ms
LOG   [importer] 🧱 Verified block: Got hash 0x18ea4c6107e9bb50d45ef6041efbfc7af0f887a69c5ad5bccdbbe5ae81ed0043 for block at slot 1810.
npm error Lifecycle script `start` failed with error:
npm error code 137
npm error path /app/bin/jam
npm error workspace @typeberry/jam@0.1.0
npm error location /app/bin/jam
npm error command failed
npm error command sh -c tsx ./index.ts --version=1 fuzz-target /tmp/jam_target.sock
npm notice
npm notice New major version of npm available! 10.9.3 -> 11.6.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
npm notice To update run: npm install -g npm@11.6.0
npm notice
Cleaning up Docker container typeberry...
```


## Comment by @tomusdrw

@davxy thanks for reporting. Fixed in 0.1.1.


## Comment by @tomusdrw

We've just released `0.2.0` with GP 0.7.1 support.


## Comment by @tomusdrw

`0.4.0` is out with all relevant fixes. Passing all fuzzy vectors and current traces.


## Comment by @tomusdrw

I see new reports being submitted and I noticed that we've accidentally bumped the default GrayPaper compatibility version to 0.7.2, while I think the fuzzy vectors and reports still expect 0.7.1.

I'll double check that we pass all vectors when the default version is changed back to 0.7.1, but as a quick fix it's possible to alter the version by specifying `GP_VERSION=0.7.1` env variable.


## Comment by @tomusdrw

`0.4.1` is out with default GP version reverted to 0.7.1 and passing all available traces.


## Comment by @tomusdrw

We've just released `0.5.0` which defaults to GP version `0.7.2` and passes all available test vectors.


## Comment by @tomusdrw

`0.5.1` is out with fixes for last fuzzer rounds


## Comment by @mateuszsikora

@davxy can you share the logs from our client that are connected with traces `1766244122_3401`, `1766244251_4514` and `1766565819_9888`? We pass these tests locally when running just a single case, so it must be some long-running issue and it would be great if we could reproduce that locally or at least have a bit more info why the node crashed.


## Comment by @tomusdrw

Heads up: `0.5.3` is out with performance improvements and hopefully fixes for crashes as well🤞.
