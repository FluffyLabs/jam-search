---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/311'
title: Block Importer
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-01T20:43:02.000Z'
last_modified: '2025-04-01T20:43:02.000Z'
content_kind: issue
---

# Block Importer

## Issue by @tomusdrw

Currently we run #237 tests using `state_transitions` JSONs. i.e. we don't have a full block persistence, just load the `preState`, assume the block is valid and transition the current state to the `postState`.

However we should have a way to persist the blocks & state in the node and "add" new blocks on top of it.

I'd like to propose using `.bin` block files from the test vectors to prepare a CLI that will be able to:
1. import a series of blocks contained in `.bin` files
2. persist the blocks and the state
