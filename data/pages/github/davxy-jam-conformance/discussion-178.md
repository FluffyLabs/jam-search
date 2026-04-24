---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/178'
title: 'm_jampy/fuzz-reports/0.7.2/traces/1773227511/00000048: state root mismatch'
site: github.com/davxy/jam-conformance
created_at: '2026-03-11T13:21:08.000Z'
last_modified: '2026-03-11T13:21:08.000Z'
content_kind: discussion
---

# m_jampy/fuzz-reports/0.7.2/traces/1773227511/00000048: state root mismatch

## Discussion by @dakk

In the last fuzzing session of jampy, it failed in this trace: https://raw.githubusercontent.com/w3f/jam-conformance/refs/heads/m_jampy/fuzz-reports/0.7.2/traces/1773227511/00000048.json

for a state_root value mismatch. I tried to create the state_root starting from the post_state keyvals of the trace, but I get the same value:

```0x90a5c30ebff7ae0de7c1b065635ce976a72d50a8c29e63479158a40b0d28cc54```

instead of 

```0x7e45bc1fba67fd959f79be6d11f66523212c227d320c2af2ce369ee3b57c357c```

I'm almost sure that my value is correct, but maybe this is an edge case and I'm wrong. Can someone else try to calculate the state_root of key_vals from the post_state of the trace?


EDIT:

same for this trace: https://raw.githubusercontent.com/w3f/jam-conformance/refs/heads/m_jampy/fuzz-reports/0.7.2/traces/1773236126/00000068.json

Reference: https://github.com/w3f/jam-milestone-delivery/pull/15


## Comment by @jaymansfield

@dakk I'm also seeing 0x90a5c30ebff7ae0de7c1b065635ce976a72d50a8c29e63479158a40b0d28cc54 for this trace


## Comment by @tommyldev

Same here


## Comment by @dakk

good (for me at least); my reviewer has found another trace with the same issue: https://raw.githubusercontent.com/w3f/jam-conformance/refs/heads/m_jampy/fuzz-reports/0.7.2/traces/1773236126/00000068.json


## Comment by @bloppan

Same here 


## Comment by @bloppan

> good (for me at least); my reviewer has found another trace with the same issue: https://raw.githubusercontent.com/w3f/jam-conformance/refs/heads/m_jampy/fuzz-reports/0.7.2/traces/1773236126/00000068.json

In this trace I see 0x58c79e3c24a77da014b3763a0ba9afc8504eddf95ae106235749ea4e4fd3565d 


## Comment by @dakk

Same; the maintainer fuzzing my impl said the issue raised after latest polkajam update, they're already inspecting it


## Comment by @davxy

@midegdugarova I imagine that we can retire these traces?
