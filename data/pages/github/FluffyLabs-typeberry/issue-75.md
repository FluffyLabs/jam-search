---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/75'
title: PVM - possibility to reuse PVM instance
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-06T20:54:21.000Z'
last_modified: '2024-08-06T20:54:21.000Z'
content_kind: issue
---

# PVM - possibility to reuse PVM instance

## Issue by @mateuszsikora

Because of performance reasons it would be better to reset PVM instance and reuse it than recreate the instance (memory reallocation):
- PVM instance should expose `reset` method 
- `reset` method should reset registers, memory, pc and status
 


## Comment by @tomusdrw

Seems done already.
