---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/336'
title: Review state transition dependencies and make them explicit.
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-19T18:29:46.000Z'
last_modified: '2025-04-19T18:29:46.000Z'
content_kind: issue
---

# Review state transition dependencies and make them explicit.

## Issue by @tomusdrw

Some state transitions depend on each other. For instance, safrole validators need to be rotated before we compute statistics (using `kappa_prime`).

I think instead of relying on the state in such circumstances we should make all `prime` and `dagger` entries explicitly input parameters to that particular part of STF.


## Comment by @tomusdrw

Fixed already.
