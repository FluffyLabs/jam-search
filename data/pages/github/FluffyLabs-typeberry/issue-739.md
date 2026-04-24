---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/739'
title: Fix ServiceId generation logic in accumulate test
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-26T10:33:22.000Z'
last_modified: '2025-10-26T10:33:22.000Z'
content_kind: issue
---

# Fix ServiceId generation logic in accumulate test

## Issue by @coderabbitai[bot]

## Problem

The test in `packages/jam/transition/accumulate/accumulate.test.ts` (around lines 298-307) has incorrect ServiceId generation logic that produces invalid test data.

### Current Behavior
- The test seeds the sequence with `tryAsServiceId(0)`, which is outside the valid public service ID range
- This causes the loop to collapse to a single repeated value: `[0, 4294901505, 4294901505, ..., 4294901505]`
- The test cannot properly verify distinct ID generation

### Expected Behavior
- ServiceIds should be generated within the valid public service range: `[MIN_PUBLIC_SERVICE_INDEX, 2^32 − 2^8)` = `[65536, 4294901248)`
- The sequence should produce 10 distinct ServiceIds

### Suggested Fix
Either:
1. Start with a valid ID in the public range (e.g., `tryAsServiceId(MIN_PUBLIC_SERVICE_INDEX)`)
2. Use the production formula from `bumpServiceId` (+42 instead of +1)
3. Redesign to properly cycle through the expected range

### References
- Pull Request: https://github.com/FluffyLabs/typeberry/pull/716
- Original Comment: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2463146970
- Requested by: @tomusdrw
