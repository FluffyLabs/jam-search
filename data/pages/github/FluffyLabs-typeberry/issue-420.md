---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/420'
title: Incomplete service removal leaves orphaned data in state
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-10T12:11:15.000Z'
last_modified: '2025-06-10T12:11:15.000Z'
content_kind: issue
---

# Incomplete service removal leaves orphaned data in state

## Issue by @coderabbitai[bot]

## Problem

The `serializeRemovedServices()` function in `packages/jam/state-merkleization/serialize-update.ts` only removes the main `serviceData` entry when a service is removed, but leaves behind orphaned sub-keys including:

- Preimages
- Storage items  
- Lookup history entries

This incomplete removal causes:
- **State bloat**: Orphaned data accumulates permanently
- **State inconsistency**: References to non-existent services remain

## Current Implementation

The function only removes the service's main data:
```typescript
function* serializeRemovedServices(servicesRemoved: ServiceId[] | undefined): Generator<SerializeOutput> {
  for (const serviceId of servicesRemoved ?? []) {
    // TODO [ToDr] what about all data associated with a service?
    const codec = serialize.serviceData(serviceId);
    yield [TrieAction.Remove, codec.key, EMPTY_BLOB];
  }
}
```

## Expected Solution

Complete service removal should purge all keys prefixed with the service ID, similar to:
```typescript
// delete service meta-data
yield [TrieAction.Remove, serialize.serviceData(serviceId).key, EMPTY_BLOB];

// delete all storage / preimages / lookup history under that service  
for (const { key } of serialize.iterateServiceNamespace(serviceId)) {
  yield [TrieAction.Remove, key, EMPTY_BLOB];
}
```

## Investigation Needed

- Determine how to enumerate all keys for a given service ID
- Ensure the removal approach doesn't break state consistency
- Consider performance implications of bulk removals

## References

- Original discussion: https://github.com/FluffyLabs/typeberry/pull/419#discussion_r2137698672
- PR: https://github.com/FluffyLabs/typeberry/pull/419
- Identified by: @tomusdrw


## Comment by @tomusdrw

This is not the case, since service can only be removed after all it's items are cleaned up. Closing.
