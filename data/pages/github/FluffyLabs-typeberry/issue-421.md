---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/421'
title: 'Fix state handling in STF: avoid shared mutable state singleton'
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-10T12:12:38.000Z'
last_modified: '2025-06-10T12:12:38.000Z'
content_kind: issue
---

# Fix state handling in STF: avoid shared mutable state singleton

## Issue by @coderabbitai[bot]

## Problem

Fix how state is being passed to STF. We currently assume the state object is internally mutated, so every STF holds it as readonly field. Now it's not true. Currently we use a hacky solution to replace a backend of the state.

## Current Implementation Issues

- The importer holds a single `SerializedState` instance as a readonly field
- Uses `updateBackend()` method to mutate the backend in place
- This creates risks of stale views if blocks are imported in parallel or forks occur
- Assumes blocks are imported strictly sequentially
- Assumes no other components hold references to the old backend

## Potential Solutions

1. Change the main OnChain STF and create smaller ones each time
2. Pass the state as input parameter instead of holding it as a readonly field

## Context

Related to the LMDB state storage implementation where state is now serialized rather than held in-memory.

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/419
- Comment: https://github.com/FluffyLabs/typeberry/pull/419#discussion_r2137698677
