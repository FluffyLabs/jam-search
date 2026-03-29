---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/23'
title: Preimages unneeded tests
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-15T18:49:04.000Z'
last_modified: '2025-02-15T18:49:04.000Z'
---

# Preimages unneeded tests

## Issue by @bloppan

Hi @davxy , the preimage test "preimage_not_needed-1" ends up with the error "preimage_unneeded", but the GP says that "We disregard, [without prejuice](https://graypaper.fluffylabs.dev/#/5f542d7/189700189700)". So if there is no prejuice, I think the test should end up without an error.


## Comment by @xlc

> We disregard, without prejudice, any preimages which **due to the effects of accumulation** are no longer useful.

So it still needs to be requested. It is if due to effect of accumulation, e.g. remove a service, then the preimage should not be needed anymore, and only in that case, it is ok to have unused preimage.


## Comment by @davxy

See @xlc comment
