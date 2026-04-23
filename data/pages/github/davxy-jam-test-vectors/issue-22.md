---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/22'
title: JSON Block/State Representation Improvement
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-15T01:13:04.000Z'
last_modified: '2025-02-15T01:13:04.000Z'
content_kind: issue
---

# JSON Block/State Representation Improvement

## Issue by @sourabhniyogi

JAM implementers mostly can be expected to follow the STF Vectors JSON attribute names and structures -- we have shared blocks+state transitions [here](https://github.com/jam-duna/jamtestnet/tree/0.6.2.2/data) and found a bit of contention on [flattened vs nested gamma]( https://github.com/jam-duna/jamtestnet/issues/65#issuecomment-2660321179) between ourselves which we believe are best resolved by the W3F "official" jamtestvectors, mostly being produced by you @davxy here.

Many of us are getting increasingly vested in these JSON attributes/structure representations, down to knowing the mapping between greek letters and C1-C15 by  heart, so if there is some GP version in 0.6.x to 0.9.x to just get something reasonable nailed down that would be meaningful to get right once and then have it affect the a few dozen teams attempt to pass STF... well, we'd love to see that happen in the next couple of months.  

Issues that we have encountered in our regular JAM implementation life include:
* English names vs greek letters (`recent_blocks` vs `beta`)
* nested vs flat (`gamma` components flattened vs nested )  
* verbosity vs terseness (`preimage_hash` vs `hash` vs `h`, `blob_length` vs `length` vs `l`)
* service key-value storage (for state_root completeness)
* state components matching GP JAM codec representations as closely as possible when possible
* missing components (most notably [state transitions](https://github.com/jam-duna/jamtestnet/blob/0.6.2.2/data/assurances/state_transitions/3_004.json))

Now that GP is getting "tweaky" for 0.6.x  to 0.9.x, we believe achieving JSON Block/State Representation stability would be very meaningful along the above lines.  Naturally, many of these are "ad hoc" decisions ... but all of us likely will look to these decisions to form a Schelling point rather than make different "ad hoc" decisions separately, so that we may coherently achieve consistency between our JAM client implementations.  





## Comment by @sourabhniyogi

Concerning providing the genesis files from this link (https://github.com/jam-duna/jamtestnet/tree/main/chainspecs/rawkv) in binary format as well -- Is [this](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs/rawkv/README.md) what you had in mind?

If not, it might be easiest if you added a single array of kv codec example [here](https://github.com/w3f/jamtestvectors/tree/master/codec/data) that matched [this](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs/rawkv/genesis-tiny.json) -- then we would publish json codec state\_snapshots like [this](https://github.com/jam-duna/jamtestnet/blob/main/data/safrole/state_snapshots/5_000.bin) in the same way?


## Comment by @davxy

> Concerning providing the genesis files from this link (https://github.com/jam-duna/jamtestnet/tree/main/chainspecs/rawkv) in binary format as well -- Is [this](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs/rawkv/README.md) what you had in mind?
> 
> If not, it might be easiest if you added a single array of kv codec example [here](https://github.com/w3f/jamtestvectors/tree/master/codec/data) that matched [this](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs/rawkv/genesis-tiny.json) -- then we would publish json codec state_snapshots like [this](https://github.com/jam-duna/jamtestnet/blob/main/data/safrole/state_snapshots/5_000.bin) in the same way?

That is fine for me.
FWIW I currently read the genesis state kv directly from hainspecs/traces/genesis-tiny.bin. Which IIUC should contain the same data


## Comment by @sourabhniyogi

Thank you for getting us started on the state transitions journey -- closing this in favor of https://github.com/davxy/jam-test-vectors/issues/40
