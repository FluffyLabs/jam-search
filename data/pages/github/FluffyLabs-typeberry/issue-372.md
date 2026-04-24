---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/372'
title: 'Refactor: Move pvm-debugger-adapter from core to JAM'
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-12T15:37:45.000Z'
last_modified: '2025-05-12T15:37:45.000Z'
content_kind: issue
---

# Refactor: Move pvm-debugger-adapter from core to JAM

## Issue by @coderabbitai[bot]

## Background
The `pvm-debugger-adapter` package is currently located in the core packages but imports JAM-related packages. This violates our architectural guideline:

> Core packages must not import any JAM-related packages (i.e. packages defined under `packages/jam/**`)

## Proposed Solution
Move the `pvm-debugger-adapter` package from `packages/core/` to `packages/jam/` to properly reflect its dependencies.

## References
- Identified in: https://github.com/FluffyLabs/typeberry/pull/369
- Discussion: https://github.com/FluffyLabs/typeberry/pull/369#discussion_r2084181592

This can be addressed in spare time and doesn't block current development.
