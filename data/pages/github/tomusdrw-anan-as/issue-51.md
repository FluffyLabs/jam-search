---
type: page
url: 'https://github.com/tomusdrw/anan-as/issues/51'
title: Make multi-page memory writes atomic
site: github.com/tomusdrw/anan-as
created_at: '2025-04-22T15:57:37.000Z'
last_modified: '2025-04-22T15:57:37.000Z'
content_kind: issue
---

# Make multi-page memory writes atomic

## Issue by @coderabbitai[bot]

## Problem
When writing data across multiple pages using the `bytesWrite` method, if a page fault occurs on a later page, the data has already been written to the earlier pages. This means a partial write has occurred, which can lead to memory inconsistency.

## Expected Behavior
The write operation should be atomic - either all pages are successfully written to, or none at all. If a page fault occurs at any point during a multi-page write, no memory should be altered.

## Current Implementation
In the current implementation of `bytesWrite`, the code processes the write page by page in a loop:

```typescript
bytesWrite(address: u32, source: Uint8Array): MaybePageFault {
  let nextAddress = address;
  let sourceIndex = 0;

  while (sourceIndex < source.length) {
    const bytesLeft = source.length - sourceIndex;
    const pageData = this.getPage(Access.Write, nextAddress);
    if (pageData.fault.isFault) {
      return pageData.fault;
    }
    // ... write data to the page ...
    sourceIndex += bytesToWrite;
    nextAddress += bytesToWrite;
  }

  return NO_PAGE_FAULT;
}
```

When a page fault occurs, the method immediately returns an error, but any data written to previous pages remains, creating a partial write situation.

## Related PR Discussion
This issue was identified during the review of PR #49: https://github.com/tomusdrw/anan-as/pull/49#discussion_r2054410832
