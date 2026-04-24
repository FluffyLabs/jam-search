---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/623'
title: '[fuzz] Clean up / reuse database on `resetState`.'
site: github.com/FluffyLabs/typeberry
created_at: '2025-09-15T10:12:50.000Z'
last_modified: '2025-09-15T10:12:50.000Z'
content_kind: issue
---

# [fuzz] Clean up / reuse database on `resetState`.

## Issue by @tomusdrw

Currently the database will stay hanging forever, so over time the database directory will grow indefinitely.


## Comment by @tomusdrw

Fixed in #628 
