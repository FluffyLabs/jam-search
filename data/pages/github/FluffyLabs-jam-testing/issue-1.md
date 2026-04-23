---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/1'
title: Fuzzing all targets
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-13T16:57:13.000Z'
last_modified: '2026-03-13T16:57:13.000Z'
content_kind: issue
---

# Fuzzing all targets

## Issue by @tomusdrw

I'm happy to integrate fuzz sources into this repo and have them be running against all of the same targets.

The idea is for each target/team to attach & sponsor their own Github Actions Runner that would be exclusively used to run fuzzing on their implementation.

The performance and minimal conformance (via minifuzz) would be performed on a dedicated perf runner as it is currently.

If anyone is interested in either:
1. providing a fuzz source or
2. attaching their dedicated runner to get fuzzed

please get in touch on element: @tomusdrw:matrix.org


## Comment by @sierkov

@tomusdrw I'm interested in providing a dedicated runner to fuzz TurboJam. Please let me know what the next steps would be.


## Comment by @tomusdrw

> [@tomusdrw](https://github.com/tomusdrw) I'm interested in providing a dedicated runner to fuzz TurboJam. Please let me know what the next steps would be.

Can you message me on Matrix please: @tomusdrw:matrix.org ? When you have your machine with github actions runner ready, I'll pass you the token to have it registered with the repo. It will be correctly labelled to be exclusive used for turbojam fuzz workflow. Note, currently we only have one fuzz source available (graymatter) and I believe it doesn't do much mutations yet (CC @ ggwpez).

For anyone not willing to go through the hassle of setting up your own runner, please get in touch as well, I can help with that too.


