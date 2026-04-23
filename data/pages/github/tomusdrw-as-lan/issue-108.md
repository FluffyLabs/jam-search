---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/108'
title: >-
  feat(sdk): add rich type storage helpers (e.g. storage.u64(key),
  storage.object(Codec, key))
site: github.com/tomusdrw/as-lan
created_at: '2026-04-20T20:22:34.000Z'
last_modified: '2026-04-20T20:22:34.000Z'
content_kind: issue
---

# feat(sdk): add rich type storage helpers (e.g. storage.u64(key), storage.object(Codec, key))

## Issue by @coderabbitai[bot]

## Summary

Currently, reading/writing typed values from storage requires manual codec usage and boilerplate (e.g. constructing a `LibraryEntry` via `LibraryEntryCodec`, decoding from raw bytes, etc.). Adding convenience helpers for common types would reduce friction for service authors.

## Proposed API

Add typed accessor helpers on the storage API, for example:

```ts
// Read/write a u64 value
storage.u64(key): u64 | null
storage.writeU64(key, value: u64): void

// Read/write an arbitrary codec-typed object
storage.object<T>(codec: TryDecode<T>, key): T | null
storage.writeObject<T>(codec: TryEncode<T>, key, value: T): void
```

## Motivation

Raised in the context of [PR #102](https://github.com/tomusdrw/as-lan/pull/102) ([comment](https://github.com/tomusdrw/as-lan/pull/102#discussion_r3113443914)), where `LibraryEntry` objects are manually encoded/decoded to/from raw storage bytes. Rich type helpers would simplify such patterns significantly.

## Requested by

@tomusdrw
