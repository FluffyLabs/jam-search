---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/25'
title: 'Demo fuzz failure: graymatter → javajam'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-25T21:19:38.000Z'
last_modified: '2026-03-25T21:19:38.000Z'
---

# Demo fuzz failure: graymatter → javajam

## Issue by @github-actions[bot]

cc @jaymansfield

The demo graymatter fuzz source test against **javajam** failed.

**Run:** https://github.com/FluffyLabs/jam-testing/actions/runs/23564587582

Please investigate and close this issue once resolved.


## Comment by @tomusdrw

Hmm, okay I guess it's not spurious then :)


## Comment by @jaymansfield

Reverted the change to my build script and looks like it might be okay now.

Thanks for setting up these automated runs, extremely useful!

By the way, there are no permissions set for implementors to close these issues themselves.


## Comment by @tomusdrw

> By the way, there are no permissions set for implementors to close these issues themselves.

AFAIK the only solution would be to add everyone to the repo with "triage" permissions, which I'm a bit reluctant to do. So for now we will have to live with manual closing.
