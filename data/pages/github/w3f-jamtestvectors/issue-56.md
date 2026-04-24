---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/56'
title: Trace test vectors Preimage accumulation invocation.
site: github.com/w3f/jamtestvectors
created_at: '2025-11-16T13:31:07.000Z'
last_modified: '2025-11-16T13:31:07.000Z'
content_kind: issue
---

# Trace test vectors Preimage accumulation invocation.

## Issue by @mikirov

I am trying to run an accumulation invocation on the preimages from:

👉 https://github.com/davxy/jam-test-vectors/blob/84213c3fa619f26d77f61601a7dd77048f6bbf7a/traces/preimages_light/00000002.json

The blob itself is parsed as a valid SPI program.
However, there are two uninitialized zones in the stack region, causing read calls to return zeros. These zeros get assigned to registers 7–10, so when the FETCH host call is invoked, those registers contain zero.

Because of this, the Fetch host call returns without writing to RAM. The program then invokes the JIP-1 LOG host call with message:

“Panic handler invoked!”

This behavior occurs both in my implementation and in Anan-As’ PVM:

👉 https://pvm.fluffylabs.dev/?#/

Execution Dump

https://gist.github.com/mikirov/dd5cb849d15e17d71fbf0661259b2f42

SPI Program Used

https://gist.github.com/mikirov/84ebde727761203a8b4a0a1e9d670e62

⸻

Request

Execution traces from other PVM implementations are welcome to help confirm whether this behavior is the expected result.


## Comment by @tomusdrw

@mikirov are you sure about the test vector? [00000002.json](https://github.com/davxy/jam-test-vectors/blob/84213c3fa619f26d77f61601a7dd77048f6bbf7a/traces/preimages_light/00000002.json) does not invoke PVM at all afaict. You can see that post-state statistics for the services does not have any accumulate count / gas used. (Feel free to load in our [state viewer](https://state.fluffylabs.dev/) and view the "Diff").


## Comment by @mikirov

@tomusdrw  The preimage it loads is the same as all other traces test vectors. Its not about the trace execution. I am trying to specify which bytecode i am trying to load. If you have ideas how i can point to the keyval with the preimage more clearly, i would appreciate it 🙏🏻


## Comment by @tomusdrw

Your preimage to load is most likely correct, for your test case and service with id 0 it's going to be:
```
(137072 bytes) 0x5000156a616d2d626f6f7473747261702d73657276696...
Hash: 0x69076f38642f87e2037a88d4a583b03703c744af1f02bd0bbd7df93ce1ef8f6c
```

Note that it contains metadata and the service code so it needs decoding as specified in: https://graypaper.fluffylabs.dev/#/ab2cdbd/10dd0110e801?v=0.7.2

To actually execute the pvm you also need to take a look at the following:
- spi with arguments: https://graypaper.fluffylabs.dev/#/ab2cdbd/2d5a002d5c00?v=0.7.2
- argument data encoding for accumulation: https://graypaper.fluffylabs.dev/#/ab2cdbd/2fd6032fd603?v=0.7.2

For instance for block 24 (which does execute PVM for service 0) the encoded arguments that you need to pass to SPI:
```
0x180001
``` 

The PVM debugger, unfortunately does not fully support executing SPI programs yet so you won't be able to run it there. If you did the execution would stop on the first `FETCH` host call, since the debugger does not have enough data to handle it.
