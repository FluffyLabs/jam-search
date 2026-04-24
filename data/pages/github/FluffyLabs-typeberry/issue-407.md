---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/407'
title: Run typeberry in browser.
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-01T18:37:50.000Z'
last_modified: '2025-06-01T18:37:50.000Z'
content_kind: issue
---

# Run typeberry in browser.

## Issue by @tomusdrw

After #392 we should take a look at running the node in the browser.

Anything that cannot be run in the browser should be replaced with some sort of polyfill.

- [ ] CI build of typeberry library to run in the browser.
- [ ] RPC interface to be able to talk to the running node.


## Comment by @tomusdrw

Partially addressed in #584 .
We now have single `@typeberry/lib` package that contains re-export from all other packages. Not possible to run the whole node yet since we need to refactor the way workers are created so that there is no strict dependency on `lmdb`.


## Comment by @tomusdrw

Mostly implemented already, and running blocks in browser can be tested in https://state.fluffylabs.dev/
