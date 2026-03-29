---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/85'
title: wrong proof in Tickets Extrinsic
site: github.com/davxy/jam-test-vectors
created_at: '2025-07-09T08:45:30.000Z'
last_modified: '2025-07-09T08:45:30.000Z'
---

# wrong proof in Tickets Extrinsic

## Issue by @daiagi

In GP 0.6.5 the signatures in the Ticket extrinsic changes to use posterior epoch’s Bandersnatch key root

https://graypaper.fluffylabs.dev/#/38c4e62/0f7f000f8200?v=0.7.0

https://github.com/gavofyork/graypaper/pull/333


In Jamixir, we missed this changed, but we are able to pass all test vectors

When we have implemented this change, Safrole test vectors were failing  due to "bad_ticket_proof"

this makes me suspect that the test vectors also missed and did not implement this change

@davxy  could you confirm please?





## Comment by @davxy

I'm currently ooo, but I'll take a look as soon as I can. From what I recall, we were already handling it correctly (i.e. the issue was in the GP only). Do you have a specific test vector you'd like me to focus on? Thanks!
