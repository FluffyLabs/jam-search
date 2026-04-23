---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/342'
title: Enhance memory.storeFrom to handle data spanning more than two pages
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-22T12:26:43.000Z'
last_modified: '2025-04-22T12:26:43.000Z'
content_kind: issue
---

# Enhance memory.storeFrom to handle data spanning more than two pages

## Issue by @coderabbitai[bot]

## Description

Currently, the `memory.storeFrom` function only supports writing data that spans at most two pages, as indicated by the TODO comment:

```typescript
// TODO [ToDr] This should support writing to more than two pages.
```

While `memory.loadInto` seems to already handle data spanning multiple pages by iterating through all pages in range, `memory.storeFrom` is limited to just two pages.

## Requirements

- Enhance `memory.storeFrom` to handle data spanning any number of pages, similar to how `memory.loadInto` handles it.
- Update tests to verify this functionality works correctly.

## References

- [PR comment](https://github.com/FluffyLabs/typeberry/pull/337#discussion_r2053683851)

Originally requested by @tomusdrw with @mateuszsikora CC'd.
