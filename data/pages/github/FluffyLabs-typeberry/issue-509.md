---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/509'
title: Update lastAccumulation field during accumulation process
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-25T09:43:30.000Z'
last_modified: '2025-07-25T09:43:30.000Z'
content_kind: issue
---

# Update lastAccumulation field during accumulation process

## Issue by @coderabbitai[bot]

## Description

The `lastAccumulation` field in `ServiceAccountInfo` should be updated during the accumulation process to reflect when a service was last accumulated.

## Context

During the update to gp 0.6.7, new fields were added to `ServiceAccountInfo` including `lastAccumulation: TimeSlot`. Currently, this field is initialized with a default value of `tryAsTimeSlot(0)` in tests and service creation, but it should be updated to reflect the actual last accumulation time when services are processed during accumulation.

## Related Files

- `packages/jam/transition/accumulate/accumulate.test.ts`
- `packages/jam/state/service.ts`

## Requirements

- Update the accumulation logic to set the `lastAccumulation` field to the current timeslot when a service is accumulated
- Ensure this is properly tested in the accumulation tests
- Consider if this affects state transitions and validation logic

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/493
- Comment: https://github.com/FluffyLabs/typeberry/pull/493#discussion_r2221905456

Requested by: @tomusdrw
