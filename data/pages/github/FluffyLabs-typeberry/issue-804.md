---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/804'
title: Allow for optional synchronous accumulation
site: github.com/FluffyLabs/typeberry
created_at: '2025-11-26T21:43:01.000Z'
last_modified: '2025-11-26T21:43:01.000Z'
content_kind: issue
---

# Allow for optional synchronous accumulation

## Issue by @tomusdrw

There should be a configuration option allowing the accumulation to simply be processed synchronously and sequentially, not asynchronously as it is right know. I think that even it's currently async it does not really run in parallel, since we don't have independent pvms, yet the trace logs is mangled up because of some async operations.

Running sequentially would mostly be useful for testing to have clean traces.
