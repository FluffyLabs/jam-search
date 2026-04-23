---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/24'
title: 'Demo fuzz failure: graymatter → javajam'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-25T19:09:21.000Z'
last_modified: '2026-03-25T19:09:21.000Z'
content_kind: issue
---

# Demo fuzz failure: graymatter → javajam

## Issue by @github-actions[bot]

cc @jaymansfield

The demo graymatter fuzz source test against **javajam** failed.

**Run:** https://github.com/FluffyLabs/jam-testing/actions/runs/23557280413

Please investigate and close this issue once resolved.


## Comment by @jaymansfield

@tomusdrw are you able to try running this again? Thanks!


## Comment by @tomusdrw

Sure! The failure looks spurious. I had similar weird failures in #22 and #23, but restarted the machine since then. If these spurious failures would keep occurring I'll consider getting a dedicated server for this, since right now it's virtual with resource guarantees.
