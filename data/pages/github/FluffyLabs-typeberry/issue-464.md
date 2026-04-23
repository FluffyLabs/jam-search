---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/464'
title: Figure out how to make benchmarks less flaky.
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-07T15:54:04.000Z'
last_modified: '2025-07-07T15:54:04.000Z'
content_kind: issue
---

# Figure out how to make benchmarks less flaky.

## Issue by @tomusdrw

It seems that benchmarks are now failing quite frequently (most likely since we allow multiple jobs on the build server). It seems though it's always the same few benchmarks that go off-rails.

We've previously run a "warm-up" round of benchmarks, but that caused the builds to be super long.

Some ideas (code wise)
1. Increase the `margin`s of the benchmark values.
2. Remove explicit measurements completely and just care about what's the fastest for the failing benchmarks.
3. Figure out if there is something in `benny` that we can tune.

Some process ideas:
1. Re-run benchmarks if they fail automatically (basically have second conditional step).
2. Run benchmarks only on `main` at night, but automatically create an issue in the repo with all PRs that were merged that day to figure out which one broke stuff.


## Comment by @tomusdrw

Seems that #474 solved it, so closing.
