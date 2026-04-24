---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/737'
title: 'Refactor AnanasInterpreter: Move initialization logic to constructor'
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-25T13:46:15.000Z'
last_modified: '2025-10-25T13:46:15.000Z'
content_kind: issue
---

# Refactor AnanasInterpreter: Move initialization logic to constructor

## Issue by @coderabbitai[bot]

## Context

As discussed in PR #716, if `AnanasInterpreter` instances are meant to be used once, the initialization logic (currently in `resetJam()`) should be moved to the constructor for better design.

## Original Feedback

> If instances are meant to be used once, it would be best if this was part of the constructor instead.
>
> — @tomusdrw

## File

`packages/core/pvm-interpreter-ananas/index.ts`

## Related Links

- PR: https://github.com/FluffyLabs/typeberry/pull/716
- Comment: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2448609400

## Requested by

@DrEverr
