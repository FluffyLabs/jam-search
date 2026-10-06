---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/114'
title: Potential codec issue in 0.8.0 full vectors
site: github.com/davxy/jam-test-vectors
created_at: '2026-10-05T16:44:33.000Z'
last_modified: '2026-10-05T16:44:33.000Z'
content_kind: issue
---

# Potential codec issue in 0.8.0 full vectors

## Issue by @jaymansfield

Hey @davxy,

While going though the 0.7.2->0.8.0 diff again I noticed the ticket attempt encoding changed under 0.8.0.

E(x∈ T) ≡ E(xy ,E1(xe))

After just switching it in javajam, I can no longer parse some of the full vectors here. Can you confirm if this was updated in the vectors, or if they are still using compact for the ticket attempt numbers?

Thanks!
