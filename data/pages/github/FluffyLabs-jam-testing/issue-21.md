---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/21'
title: 'Fuzz failure: graymatter → turbojam'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-19T20:48:45.000Z'
last_modified: '2026-03-19T20:48:45.000Z'
content_kind: issue
---

# Fuzz failure: graymatter → turbojam

## Issue by @github-actions[bot]

cc @sierkov

The graymatter fuzz source test against **turbojam** failed.

**Run:** https://github.com/FluffyLabs/jam-testing/actions/runs/23310390762

Please investigate and close this issue once resolved.


## Comment by @sierkov

@tomusdrw I suspect the failure was caused by OOM, based on the following line: "[turbojam] Process had to be killed." It occurred after about two hours of fuzzing with the new block limit of 350k.

I’ve published a new Docker image that should be more memory-efficient when the blockchain grows beyond 300k blocks. Let’s wait for another testing cycle to confirm whether this resolves the issue.

One request: would it be possible to more clearly indicate when a failure is caused by OOM?


## Comment by @tomusdrw

@sierkov vibed something here: https://github.com/FluffyLabs/jam-testing/commit/23c2615c5968d3f9d50354ca5af96ca7a041c7fd I hope it will give us more details in the future.

Closing since the re-run with latest versions seems to churn along just fine.
