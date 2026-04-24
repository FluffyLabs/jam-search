---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/755'
title: >-
  Update ServicesUpdate.removed and ServicesUpdate.created to use Maps instead
  of Arrays
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-31T15:02:05.000Z'
last_modified: '2025-10-31T15:02:05.000Z'
content_kind: issue
---

# Update ServicesUpdate.removed and ServicesUpdate.created to use Maps instead of Arrays

## Issue by @skoszuta

For faster lookups, such as in the .find() in #754 


## Comment by @tomusdrw

FYI: https://jsperf.app/pisogo/2 we might want to create something like `NumericMap<K extends number, V>` which is backed by a plain object, since it's much, much faster (3x) than `Map` and faster than `Array` even for couple of elements.
