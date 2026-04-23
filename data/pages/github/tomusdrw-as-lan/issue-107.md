---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/107'
title: storage wrapper should support auto-prefixing the keys
site: github.com/tomusdrw/as-lan
created_at: '2026-04-20T20:18:41.000Z'
last_modified: '2026-04-20T20:18:41.000Z'
content_kind: issue
---

# storage wrapper should support auto-prefixing the keys

## Issue by @coderabbitai[bot]

## Summary

The storage abstraction should support auto-prefixing of keys, allowing the creation of a scoped storage wrapper. This would eliminate the need to manually construct prefixed keys (e.g., the `lib:<name>` pattern currently used in `examples/library/assembly/storage.ts`) and instead encapsulate the prefix logic within a reusable scoped storage abstraction.

## Motivation

Currently, key prefixing is done manually — for example, `libraryKey(name)` and `libraryKeyFromBlob(name)` both prepend `"lib:"` to their input. A scoped storage wrapper would allow callers to work with logical keys directly, with the prefix applied transparently.

## References

- PR: https://github.com/tomusdrw/as-lan/pull/102
- Comment: https://github.com/tomusdrw/as-lan/pull/102#discussion_r3113422161

Requested by @tomusdrw.
