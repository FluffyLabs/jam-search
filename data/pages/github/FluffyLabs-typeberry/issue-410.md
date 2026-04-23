---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/410'
title: >-
  Consensus-critical: Error handling in accumulation process should fail entire
  accumulation
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-04T19:55:59.000Z'
last_modified: '2025-06-04T19:55:59.000Z'
content_kind: issue
---

# Consensus-critical: Error handling in accumulation process should fail entire accumulation

## Issue by @coderabbitai[bot]

## Problem

Currently, when an error occurs during service accumulation in the `accumulateInParallel` method, the implementation continues processing the next service by returning `null` for `stateUpdate` and using `continue` to skip to the next iteration.

This approach has two critical issues:

1. **Unpaid computation**: Validators perform computation work but no one pays for the costs when errors occur
2. **Consensus risk**: Different implementations might handle this case differently (some ignore errors, others reject), potentially causing network splits

## Current Behavior

In `packages/jam/transition/accumulate/accumulate.ts`, when `stateUpdate` is `null`:
```typescript
if (stateUpdate === null) {
  continue;  // Just skip to next service
}
```

## Expected Behavior

The entire accumulation should fail (consider the block invalid) when errors occur during service accumulation to ensure:
- Validators are compensated for their work
- Consistent behavior across implementations
- Network consensus integrity

## References

- Pull Request: https://github.com/FluffyLabs/typeberry/pull/400
- Discussion: https://github.com/FluffyLabs/typeberry/pull/400#discussion_r2111473759

Requested by: @tomusdrw


## Comment by @tomusdrw

Additionally we should fail accumulation (i.e. consider block invalid) in case we run into an unlikely scenario of two new services getting exactly the same service id:
https://graypaper.fluffylabs.dev/#/7e6ff6a/306a02306c02?v=0.6.7


## Comment by @DrEverr

The main problem of this issue was fixed in: [PR #529 L394-R371](https://github.com/FluffyLabs/typeberry/pull/529/files#diff-490b036ab132c78d08ec99e84e942b9eb62510a0407bbad9cfe01b4a3b5586ceL394-R371).
