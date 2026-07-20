---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/101'
title: Strawberry
site: github.com/davxy/jam-conformance
created_at: '2025-10-08T04:51:45.000Z'
last_modified: '2025-10-08T04:51:45.000Z'
content_kind: issue
---

# Strawberry

## Issue by @bamzedev

Hello @davxy,

This is the tracking issue for the Strawberry client  added by this [PR](https://github.com/davxy/jam-conformance/pull/100).
Current release is `v0.0.1-ct`, GP verision `v0.7.0`, supporting forks, no Ancestry.
Minifuzz is passing all the vectors in the examples folder.


## Comment by @davxy

Hey @bamzedev here is your summary https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/summaries/summary_strawberry.txt


## Comment by @bamzedev

@davxy Thank you. In the meantime I believe we have fixed everything. We pass all available vectors, traces, fuzzer traces and report traces. We also pass all vectors for v0.7.2. So we are ready for another round with everything fixed and performance greatly increased. Do you prefer v0.7.1 or v0.7.2 build?


## Comment by @davxy

0.7.2 thank you


## Comment by @bamzedev

Hey @davxy, we are ready with `v0.7.2` https://github.com/davxy/jam-conformance/pull/133.
Thank you!


## Comment by @davxy

Your target fails to start:

```
❯ ./target.py run strawberry
Running 'strawberry' on docker image
Command: './strawberry-linux-x86_64 --socket /tmp/jam_target.sock'
Container: 'strawberry-ae6jl2'
Image: debian:stable-slim
Image ID: 7097a459326f
Created: 2025-08-11T00:00:00Z
Ensuring no leftover container with name strawberry-ae6jl2...
Waiting for target termination (pid=215019)
./strawberry-linux-x86_64: 3: Syntax error: Unterminated quoted string
Target process exited with status: 2
Cleaning up Docker container strawberry-ae6jl2...
```


## Comment by @bamzedev

Oops, that was a wrong executable by mistake. It is fixed now. Sorry @davxy.


## Comment by @bamzedev

Hello @davxy, ready for another run. Everything should be fixed. Thank you!


## Comment by @davxy

Hey @bamzedev have you implemented [std packaging](https://github.com/davxy/jam-conformance/blob/main/fuzz-proto/README.md#standard-target-packaging) for your target?


## Comment by @bamzedev

Hey @davxy Sorry for the late reply. The project got canceled in February.
