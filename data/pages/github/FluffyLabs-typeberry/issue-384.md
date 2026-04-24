---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/384'
title: Fix potential Uint8Array allocation failures
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-15T14:29:54.000Z'
last_modified: '2025-05-15T14:29:54.000Z'
content_kind: issue
---

# Fix potential Uint8Array allocation failures

## Issue by @coderabbitai[bot]

## Problem

When creating  instances with dynamic sizes, we currently don't check for potential allocation failures. JavaScript has a limit on the maximum size of arrays (often implementation-dependent, typically around 2GB or governed by available memory), and attempting to exceed this limit will throw an error rather than returning a controlled panic.

## Examples

This issue was identified in PR #378 (https://github.com/FluffyLabs/typeberry/pull/378#discussion_r2091220965) where we're allocating:
```typescript
const result = new Uint8Array(tryAsExactBytes(serviceIdAndGasCodec.sizeHint) * numberOfItemsClamped);
```

## Proposed Solution

1. We should audit all instances where we create arrays with dynamic sizes
2. Either:
   - Add size validation before attempting to create large arrays
   - Read data in smaller chunks (as done in previous implementations)
   - Implement proper error handling for allocation failures

3. Consider adding a helper function for safe array allocation

## Priority

Medium - This is potentially a reliability issue that could lead to uncontrolled crashes under specific conditions.

This issue was identified by @tomusdrw during code review.
