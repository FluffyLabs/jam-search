---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/388'
title: Fix block generator
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-16T10:20:13.000Z'
last_modified: '2025-05-16T10:20:13.000Z'
content_kind: issue
---

# Fix block generator

## Issue by @tomusdrw

Related: #387 

Currently the block generator is not able to produce valid blocks, since it can't produce proper seal.

Instead we should have a typeberry mode (can be a CLI for now), that disables the seal checks and accepts some specially-prepared seals instead.

We should also attempt to make the blocks be more coherent (i.e. using actual state transition function and state roots, etc) when generated.

This is an intro task to #387. After the generator is fixed and blocks are more coherent it should be much easier to plug-in a proper seal generation.
