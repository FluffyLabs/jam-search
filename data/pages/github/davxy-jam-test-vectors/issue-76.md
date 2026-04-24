---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/76'
title: introduce field threshold for service info in accumulate tests
site: github.com/davxy/jam-test-vectors
created_at: '2025-06-10T07:52:07.000Z'
last_modified: '2025-06-10T07:52:07.000Z'
content_kind: issue
---

# introduce field threshold for service info in accumulate tests

## Issue by @clearloop

the [ServiceInfo](https://github.com/davxy/jam-test-vectors/blob/master/stf/accumulate/tiny/enqueue_and_unlock_chain-1.json#L134) in accumulate tests are missing field `threshold` comparing with reports_l0


## Comment by @davxy

In `reports_l0`, we're using the `ServiceInfo` type, which is the structure returned by the `info` host call:

![Image](https://github.com/user-attachments/assets/3a200cbc-57e4-481c-b76e-b86b5b40cb91)

By contrast, in the `accumulate` STF vector, the service information is encoded using the format defined for the state, which does **not** include the `threshold` field:

![Image](https://github.com/user-attachments/assets/054ef524-a0d2-49d7-ac87-c2e12fbeba1c)

The two formats also differ in the encoding type: `ServiceInfo` uses **compact** encoding, while the state format uses **regular** encoding.

