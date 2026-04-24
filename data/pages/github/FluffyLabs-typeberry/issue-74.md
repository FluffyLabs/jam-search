---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/74'
title: PVM - possibility to resume execution after host call
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-06T20:50:51.000Z'
last_modified: '2024-08-06T20:50:51.000Z'
content_kind: issue
---

# PVM - possibility to resume execution after host call

## Issue by @mateuszsikora

As discussed [here](https://github.com/FluffyLabs/typeberry/pull/69#discussion_r1704891809) - Host calls can be super frequent and we need to have possibility to resume a program execution without serialisation and deserialisation whole PVM:
- PVM should expose `resume` method
- `resume` method should reset machine `status` and `exitParam`



## Comment by @tomusdrw

Implemented in #151 
