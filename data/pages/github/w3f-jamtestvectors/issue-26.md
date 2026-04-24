---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/26'
title: 'StateTransition JSON/Codec '
site: github.com/w3f/jamtestvectors
created_at: '2024-12-06T01:09:56.000Z'
last_modified: '2024-12-06T01:09:56.000Z'
content_kind: issue
---

# StateTransition JSON/Codec 

## Issue by @sourabhniyogi

We request a W3F Codec test vector for _state transitions_, which can be simply a composition of a pre and post state snapshot (as many test vectors contain, but the raw k,v data) and a block (done already):

Our suggestion is this (in Go form)
```
type StateTransition struct {
	PreState  StateSnapshotRaw `json:"pre_state"`
	Block     Block            `json:"block"`
	PostState StateSnapshotRaw `json:"post_state"`
}

type StateSnapshotRaw struct {
	StateRoot common.Hash `json:"state_root"`
	KeyVals   KeyVals     `json:"keyvals"`
}

type KeyVals []KeyVal
type KeyVal [2][]byte
```

and included stateroot.  But we think it would be useful to improve the service metadata, which was brought in recently.

We have assembled some state_transitions here in a public repo:

* [fallback](https://github.com/jam-duna/jamtestnet/tree/main/fallback/state_transitions)
* [safrole](https://github.com/jam-duna/jamtestnet/tree/main/safrole/state_transitions)
* [assurances](https://github.com/jam-duna/jamtestnet/tree/main/assurances/state_transitions)

