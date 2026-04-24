---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/314'
title: Execute state transitions fuzzed (jamduna)
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-02T09:07:48.000Z'
last_modified: '2025-04-02T09:07:48.000Z'
content_kind: issue
---

# Execute state transitions fuzzed (jamduna)

## Issue by @tomusdrw

We can already load these tests as implemented in #308 but they lack expectations.

The task is to run them one-by-one from https://github.com/jam-duna/jamtestnet/tree/8e3bbeca51af2926c1f2812e10bce020eb3e453f/data/safrole/state_transitions_fuzzed

and manually verify their execution (i.e. if we handle all the errors correctly). Example below for instance is not acceptable:
```
test at common.ts:87:45
✖ ..data/safrole/state_transitions_fuzzed/4_001_T4_BadRingProof.json (11780.525583ms)
  RuntimeError: unreachable
      at wasm://wasm/0043782a:wasm-function[220]:0x77a8f
      at wasm://wasm/0043782a:wasm-function[239]:0x781f9
      at wasm://wasm/0043782a:wasm-function[215]:0x77861
      at wasm://wasm/0043782a:wasm-function[86]:0x64931
      at module.exports.batch_verify_tickets (/Users/tomusdrw/workspace/fluffylabs/typeberry/packages/jam/safrole/node_modules/bandersnatch-wasm/pkg/bandersnatch_wasm.js:113:14)
```

After we know they fail or run correctly we should add conditions based on the test name to verify that they state the same in the future.

Command to run the tests:
```
❯❯❯ npm run jamduna -w @typeberry/test-runner -- ../jamdunavectors/data/safrole/state_transitions_fuzzed/*.json
```


## Comment by @tomusdrw

Partially done, we won't work on that further.
