---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/318'
title: Tracing
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-02T15:04:57.000Z'
last_modified: '2025-04-02T15:04:57.000Z'
content_kind: issue
---

# Tracing

## Issue by @tomusdrw

We have been using the logger very sparingly so far, but it will really be needed for debugging in the future.

We should sprinkle a bit of debugging info into every state transition to be able to figure out why blocks are being rejected or accepted.


## Comment by @tomusdrw

Done in a sufficient manner so far. Check out `JAM_LOG=trace`.
