---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/542'
title: Update TypeScript project to ES2023
site: github.com/FluffyLabs/typeberry
created_at: '2025-08-13T08:27:19.000Z'
last_modified: '2025-08-13T08:27:19.000Z'
content_kind: issue
---

# Update TypeScript project to ES2023

## Issue by @coderabbitai[bot]

## Background

The project currently uses ES2021 in tsconfig.json but the codebase is starting to use ES2023 features like `Array.prototype.toReversed()`.

## Problem

In PR #540, the code uses `ALL_VERSIONS_IN_ORDER.toReversed()` in `packages/core/utils/compatibility.ts` but TypeScript doesn't recognize this method because the project is configured for ES2021.

## Solution

Update the project's TypeScript configuration to target ES2023:

1. Update `tsconfig.json` to include ES2023 libraries
2. Verify all ES2023 features work as expected
3. Update any documentation or build processes if needed

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/540
- Comment: https://github.com/FluffyLabs/typeberry/pull/540#discussion_r2272439871

## Requested by

@DrEverr


## Comment by @tomusdrw

Already fixed.
