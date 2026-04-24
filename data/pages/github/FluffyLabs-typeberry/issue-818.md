---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/818'
title: >-
  Re-enable disabled test: should clear work-reports which were judged as
  invalid
site: github.com/FluffyLabs/typeberry
created_at: '2025-12-03T09:51:16.000Z'
last_modified: '2025-12-03T09:51:16.000Z'
content_kind: issue
---

# Re-enable disabled test: should clear work-reports which were judged as invalid

## Issue by @coderabbitai[bot]

## Context

A test in `packages/jam/transition/disputes/disputes.test.ts` was disabled during the removal of 0.6.7 compatibility.

**Test name:** `should clear work-reports which were judged as invalid`

**Reason for disabling:** The test needs updated test data for version 0.7.0+. The data should either be obtained from w3f test vectors or regenerated.

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/809
- Comment: https://github.com/FluffyLabs/typeberry/pull/809#discussion_r2584389380
- Requested by: @tomusdrw

## Action Required

Re-enable this test once the appropriate test data for version 0.7.0+ is available.


## Comment by @tomusdrw

CC @mateuszsikora 
