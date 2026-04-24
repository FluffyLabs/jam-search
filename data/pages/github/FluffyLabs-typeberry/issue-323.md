---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/323'
title: Handle incorrect service id in host calls.
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-08T07:43:27.000Z'
last_modified: '2025-04-08T07:43:27.000Z'
content_kind: issue
---

# Handle incorrect service id in host calls.

## Issue by @tomusdrw

Details:
https://github.com/FluffyLabs/typeberry/pull/322#discussion_r2031234531

It seems that host calls in #322 and #309 are all shortcutting a non-existent service and returning `None`. However in the gray paper, it seems that the correct behaviour is to defer that particular check and handle invalid memory first.

My suggestion is to solve it by allowing passing `ServiceId | null` to the `RefineExternalities` methods, so that the `if (serviceID === null)` thing is only handled in one place instead of all possible host calls.

CC @r0tc @DrEverr 


## Comment by @DrEverr

Partially w/ #368 
