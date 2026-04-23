---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/43'
title: Test vectors for services
site: github.com/davxy/jam-test-vectors
created_at: '2025-04-26T16:19:14.000Z'
last_modified: '2025-04-26T16:19:14.000Z'
content_kind: issue
---

# Test vectors for services

## Issue by @clearloop


reference to https://github.com/w3f/jamtestvectors/pull/32

1. ~~the current test vectors of [accumulate][accumulate] are no-op for account state, we can pass them all without integrating PVM, while the accumulation section is marked as completed in [M1 Conformance][m1]~~ #52 
2. debugging host calls could be a time killer since it comes across PVM and STF,  and the current logic in [accumulate/test-service](https://github.com/davxy/jam-test-vectors/blob/polkajam-vectors/accumulate/test-service/src/main.rs) has not covered all host calls yet, everybody is talking about host calls however we haven't had tests for them yet ))

Based on above, I'm wondering will we have service related state transitions in the fuzzer of M1:
- if yes, hope we can add more detailed tests for them since this could be a time killer, plus more checkboxes in [M1 Conformance][m1]
- if no, hope we can note it in https://github.com/w3f/jamtestvectors/issues/21 or mb [/accumulate](https://github.com/davxy/jam-test-vectors/tree/polkajam-vectors/accumulate)

[accumulate]: https://github.com/davxy/jam-test-vectors/tree/polkajam-vectors/accumulate
[m1]: https://github.com/w3f/jamtestvectors/issues/21


## Comment by @davxy

The conformance test tool will eventually aim to exhaustively test host function calls. You can expect something similar to [this PR](https://github.com/davxy/jam-test-vectors/pull/45), but extended to invoke host functions more randomly and with the goal of triggering faults (e.g., invalid arguments, edge cases, etc.).

- The trace-based test vectors (as shown in [PR #45](https://github.com/davxy/jam-test-vectors/pull/45)) currently only invoke a limited set of host functions: `read`, `write`, `log`, and `info`. This is an intentional starting point to align teams on the basics before introducing more complex scenarios.
- The standalone `accumulate` test vectors do not currently test any host call beyond read/write. I plan to propose some more vectors. For now, the main priority is getting all teams aligned around the trace-based vectors introduced in PR #45.


## Comment by @clearloop

good to know! will track on the trace vectors then instead of waiting for the test vectors of services!
