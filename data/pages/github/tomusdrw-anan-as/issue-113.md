---
type: page
url: 'https://github.com/tomusdrw/anan-as/issues/113'
title: >-
  Deprecate getMemory function and implement efficient memory reading via page
  pointers
site: github.com/tomusdrw/anan-as
created_at: '2025-11-03T09:02:32.000Z'
last_modified: '2025-11-03T09:02:32.000Z'
content_kind: issue
---

# Deprecate getMemory function and implement efficient memory reading via page pointers

## Issue by @coderabbitai[bot]

## Background

The `getMemory(address: u32, length: u32)` function in `assembly/api-debugger.ts` has been marked as deprecated due to performance and reliability issues.

## Problem

The current implementation is extremely inefficient because:
1. It copies memory multiple times
2. It's error-prone as we may not be able to allocate sufficient memory

## Proposed Solution

Instead of the current approach, WASM should be able to return memory pointers for already allocated pages. This would enable:
1. No additional allocations on the WASM side
2. Direct copying from WASM memory on the JS side

The suggested implementation pattern is provided in the deprecation comment in the code.

## References

- PR: https://github.com/tomusdrw/anan-as/pull/112
- Comment: https://github.com/tomusdrw/anan-as/pull/112#discussion_r2485749395
- Requested by: @tomusdrw


## Comment by @tomusdrw

(pseudo)code to be used on the host side (needs indices alignment)

```ts
let pagesRead = 0;
for (let address = start; address < end; address += PAGE_SIZE) {
   const page = address >> PAGE_SIZE_SHIFT;
   const maybePointer = getPagePointer(page);
   // check page fault
   if (maybePointer === null) {
     throw new Error(`Page fault at ${page << PAGE_SIZE_SHIFT}`);
   }
   // otherwise copy to JS
   destination.set(
     pagesRead << PAGE_SIZE_SHIFT,
     new Uint8Array(wasm.instance.memory, maybePointer, Math.min(end, PAGE_SIZE))
   );
   pagesRead += 1;
}
```
