---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/734'
title: Handle abort more gracefully in AnanasInterpreter
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-25T13:43:45.000Z'
last_modified: '2025-10-25T13:43:45.000Z'
content_kind: issue
---

# Handle abort more gracefully in AnanasInterpreter

## Issue by @coderabbitai[bot]

## Context

Related to PR #716 and discussion: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2448597782

Requested by: @DrEverr
Raised by: @tomusdrw

## Issue

Currently, the abort handler in `AnanasInterpreter` simply throws an error when abort is called from WASM. This might not be the most graceful way to handle this situation.

## Suggestion

Consider storing an indication on the `AnanasInterpreter` object that the instance is bricked, so that subsequent calls to any of the methods will fail in a more controlled manner.

## References
- PR: https://github.com/FluffyLabs/typeberry/pull/716
- Comment: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2448597782
