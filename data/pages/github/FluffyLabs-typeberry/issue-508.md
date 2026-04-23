---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/508'
title: Update Bless host call to support GP 0.6.7 with proper version compatibility
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-25T08:02:27.000Z'
last_modified: '2025-07-25T08:02:27.000Z'
content_kind: issue
---

# Update Bless host call to support GP 0.6.7 with proper version compatibility

## Issue by @coderabbitai[bot]

## Description

The `Bless` host call implementation in `packages/jam/jam-host-calls/accumulate/bless.ts` currently has a provisional update for GP ^0.6.7 that needs to be properly implemented with version compatibility support.

## Current State

The current implementation has a TODO comment indicating the need for proper updates:
```typescript
// TODO: [MaSo] need to be updated properly to gp ^0.6.7
this.partialState.updatePrivilegedServices(
  manager,
  tryAsPerCore(new Array(this.chainSpec.coresCount).fill(authorization), this.chainSpec),
  validator,
  autoAccumulateEntries,
);
```

## Required Changes

1. **Implement proper version compatibility**: Use the `Compatibility` pattern (similar to other parts of the codebase) to handle differences between GP versions
2. **Support older versions**: Ensure backward compatibility with versions prior to 0.6.7 where `authManager` was a single `ServiceId` rather than `PerCore<ServiceId>`
3. **Remove provisional implementation**: Replace the current array-filling approach with proper version-aware logic

## References

- Related PR: https://github.com/FluffyLabs/typeberry/pull/499
- Comment: https://github.com/FluffyLabs/typeberry/pull/499#discussion_r2230432711
- File: `packages/jam/jam-host-calls/accumulate/bless.ts`

## Acceptance Criteria

- [ ] `Bless` class properly handles both pre-0.6.7 and 0.6.7+ versions
- [ ] Uses `Compatibility` pattern for version detection
- [ ] Removes the TODO comment
- [ ] Maintains backward compatibility with existing functionality
- [ ] Includes appropriate tests for both version paths


## Comment by @tomusdrw

Done in #559 
