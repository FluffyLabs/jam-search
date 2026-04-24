---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/735'
title: Find a general solution to replace ananas API type
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-25T13:43:50.000Z'
last_modified: '2025-10-25T13:43:50.000Z'
content_kind: issue
---

# Find a general solution to replace ananas API type

## Issue by @coderabbitai[bot]

Currently, the ananas API type in `packages/core/pvm-interpreter-ananas/api.ts` is a predefined type that shouldn't be necessary. We need to find a more general solution that can replace this specific implementation.

**Context:**
This issue was raised during PR review where it was noted that the predefined type approach is not ideal and should be replaced with a more flexible, general solution.

**Related PR:** https://github.com/FluffyLabs/typeberry/pull/716
**Original Discussion:** https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2448558950

**Requested by:** @DrEverr

**Action Items:**
- Investigate alternatives to predefined API types
- Design a more general solution that doesn't require type-specific implementations
- Remove the ananas API type once the general solution is implemented


## Comment by @tomusdrw

Done in #716 
