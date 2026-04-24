---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/536'
title: Clean up deprecated fullStateDumpFromJson function
site: github.com/FluffyLabs/typeberry
created_at: '2025-08-12T08:25:23.000Z'
last_modified: '2025-08-12T08:25:23.000Z'
content_kind: issue
---

# Clean up deprecated fullStateDumpFromJson function

## Issue by @coderabbitai[bot]

## Background

The `fullStateDumpFromJson` function in `packages/jam/state-json/dump.ts` is no longer used in any significant places after the introduction of `JsonStateDumpPre067` class for handling pre-0.6.7 state dumps.

## Context

- The function's only purpose was to support jamduna test vectors (pre-0.6.7)
- A separate `JsonStateDumpPre067` class has been introduced to handle the legacy format properly
- The current `fullStateDumpFromJson` can now be safely removed

## Task

Clean up the codebase by removing the deprecated `fullStateDumpFromJson` function and any related unused code.

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/512
- Comment: https://github.com/FluffyLabs/typeberry/pull/512#discussion_r2261304338
- Requested by: @tomusdrw
