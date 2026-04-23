---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/503'
title: 'Refactor deferred transfers to reuse partial state logic from PR #492'
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-24T08:47:50.000Z'
last_modified: '2025-07-24T08:47:50.000Z'
content_kind: issue
---

# Refactor deferred transfers to reuse partial state logic from PR #492

## Issue by @coderabbitai[bot]

## Description

As mentioned by @tomusdrw in [PR #487](https://github.com/FluffyLabs/typeberry/pull/487#discussion_r2225657687), now that PR #492 has landed, we should consider refactoring the deferred transfers implementation to reuse the partial state logic instead of re-implementing parts of that functionality.

## Current Implementation

The `DeferredTransfers` class in `packages/jam/transition/accumulate/deferred-transfers.ts` currently implements its own logic for handling service state updates and transfers. This may duplicate functionality that is now available through the partial state implementation from PR #492.

## Proposed Solution

- Review the partial state functionality introduced in PR #492
- Identify opportunities to refactor the deferred transfers implementation to leverage existing partial state logic
- Reduce code duplication and improve maintainability

## Context

- Original discussion: https://github.com/FluffyLabs/typeberry/pull/487#discussion_r2225657687
- Related PR: #487 (Deferred transfers and other fixes)
- Suggested by: @tomusdrw

## Acceptance Criteria

- [ ] Analyze the overlap between deferred transfers logic and partial state functionality
- [ ] Refactor deferred transfers to reuse partial state logic where appropriate  
- [ ] Ensure all existing tests continue to pass
- [ ] Update documentation if necessary


## Comment by @tomusdrw

Already fixed.
