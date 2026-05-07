---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/30'
title: 'Fuzz failure: graymatter → turbojam'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-04-30T18:38:57.000Z'
last_modified: '2026-04-30T18:38:57.000Z'
content_kind: issue
---

# Fuzz failure: graymatter → turbojam

## Issue by @github-actions[bot]

cc @sierkov

The graymatter fuzz source test against **turbojam** failed.

**Run:** https://github.com/FluffyLabs/jam-testing/actions/runs/25182835260

Please investigate and close this issue once resolved.


## Comment by @sierkov

@tomusdrw I believe this failure is a consequence of turbojam switching to [Standard Target Packaging](https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#standard-target-packaging).

Do you plan to add support for such images? I think this would also help jam-testing support all active implementations.
As of today, 9 implementations already support the new target packaging expectations.


## Comment by @tomusdrw

> Do you plan to add support for such images? 

Yes. Will fix that shortly.


## Comment by @sierkov

The recently added support for JAM Standard Target Packaging fixed the issue.


## Comment by @sierkov

I don’t have permission to close this myself, so I’m leaving this comment instead.
