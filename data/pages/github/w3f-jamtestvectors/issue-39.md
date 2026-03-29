---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/39'
title: Incorrect extrinsic_hash in the codec block test vector
site: github.com/w3f/jamtestvectors
created_at: '2025-03-18T16:51:26.000Z'
last_modified: '2025-03-18T16:51:26.000Z'
---

# Incorrect extrinsic_hash in the codec block test vector

## Issue by @greywolve

Seems like the `extrinsic_hash` needs to be updated to reflect the change in the GP v0.5, [see here](https://github.com/w3f/jamtestvectors/blame/041b83546db2081e2904234527a0182f14605a23/codec/data/block.json#L5).


## Comment by @greywolve

Never mind, I'm guessing these values are meant to just be random.
