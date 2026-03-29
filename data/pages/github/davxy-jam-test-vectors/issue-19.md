---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/19'
title: Preimages input ordering
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-12T12:44:12.000Z'
last_modified: '2025-02-12T12:44:12.000Z'
---

# Preimages input ordering

## Issue by @skoszuta

Hello, looking at the input data of the following test vectors:
- https://github.com/davxy/jam-test-vectors/blob/polkajam-vectors/preimages/data/preimage_not_needed-1.json
- https://github.com/davxy/jam-test-vectors/blob/polkajam-vectors/preimages/data/preimage_not_needed-2.json
it seems to me that the order of items is incorrect (they should be ordered as per https://graypaper.fluffylabs.dev/#/5f542d7/181500181800). Given they have the same requester we should compare blobs (https://matrix.to/#/!ddsEwXlCWnreEGuqXZ:polkadot.io/$TV7zJQWytKV4pM_RFobjGunxD7UeBnZNnWZtez7H4nM?via=matrix.org&via=web3.foundation; lexicographically as per https://graypaper.fluffylabs.dev/#/5f542d7/07c40007c400) and that indicates that the order of items in the input data should be reversed.

If this is correct I'm happy to submit a PR.

Cheers


## Comment by @davxy

@skoszuta Good catch. Fixed by https://github.com/davxy/jam-test-vectors/pull/20
Can you give it a try? Ty


## Comment by @skoszuta

It looks and works well! Thanks
