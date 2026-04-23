---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/637'
title: Add `minifuzz` to CI
site: github.com/FluffyLabs/typeberry
created_at: '2025-09-16T10:26:00.000Z'
last_modified: '2025-09-16T10:26:00.000Z'
content_kind: issue
---

# Add `minifuzz` to CI

## Issue by @tomusdrw

`minifuzz` examples should be tested on the CI to make sure our `fuzz-target` is compatible.

See:
https://github.com/davxy/jam-conformance/pull/85

Task list:
1. Update `jam-conformance` in https://github.com/FluffyLabs/test-vectors and use `minifuzz` from there.
2. Create GHA workflow to start the `fuzz-target` and execute `minifuzz`.
3. Alternatively create a docker image (or docker compose) that runs our `fuzz-target` and `minifuzz` against it.


## Comment by @tomusdrw

Running in: https://github.com/FluffyLabs/typeberry-testing
