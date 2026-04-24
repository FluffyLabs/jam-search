---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/736'
title: >-
  Remove interpreter instance manager from pvm-host-calls and depend only on
  pvm-interface
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-25T13:45:14.000Z'
last_modified: '2025-10-25T13:45:14.000Z'
content_kind: issue
---

# Remove interpreter instance manager from pvm-host-calls and depend only on pvm-interface

## Issue by @coderabbitai[bot]

## Context

As discussed in PR #716, the `pvm-host-calls` package currently depends on `@typeberry/pvm-interpreter` and `@typeberry/pvm-interpreter-ananas` because of the interpreter instance manager.

Ideally, this package should only depend on `@typeberry/pvm-interface` and not any specific interpreter implementations.

## Objective

- Remove the interpreter instance manager from pvm-host-calls
- Refactor the package to only rely on `@typeberry/pvm-interface`
- Eliminate dependencies on `@typeberry/pvm-interpreter` and `@typeberry/pvm-interpreter-ananas`

## References

- Pull Request: https://github.com/FluffyLabs/typeberry/pull/716
- Discussion: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2448353470
- Requested by: @DrEverr
