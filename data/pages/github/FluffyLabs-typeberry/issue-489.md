---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/489'
title: Update erasure coding test vectors to GP 0.7.0
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-17T12:03:04.000Z'
last_modified: '2025-07-17T12:03:04.000Z'
content_kind: issue
---

# Update erasure coding test vectors to GP 0.7.0

## Issue by @coderabbitai[bot]

## Description

The erasure coding test vectors in the W3F test suite need to be updated to GP 0.7.0. Currently, these tests are ignored in the test runner due to this incompatibility.

## Context

- **File**: `bin/test-runner/w3f.ts`
- **TODO Comment**: `TODO [ToDr] Erasure coding test vectors need to be updated to GP 0.7.0`
- **Current Status**: The `erasure/` directory is currently in the ignored list

## Related Links

- Test vectors update PR: https://github.com/davxy/jam-test-vectors/pull/74
- Original PR: https://github.com/FluffyLabs/typeberry/pull/486
- Comment: https://github.com/FluffyLabs/typeberry/pull/486#discussion_r2213145656

## Expected Outcome

Once the erasure coding test vectors are updated to GP 0.7.0, the `erasure/` directory should be removed from the ignored list in the test runner configuration.
