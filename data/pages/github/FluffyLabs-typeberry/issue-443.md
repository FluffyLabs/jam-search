---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/443'
title: Make @typeberry/utils browser-compatible
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-18T20:34:02.000Z'
last_modified: '2025-06-18T20:34:02.000Z'
content_kind: issue
---

# Make @typeberry/utils browser-compatible

## Issue by @coderabbitai[bot]

## Problem

The `@typeberry/utils` package contains Node.js-specific code that breaks browser compatibility, specifically:

1. **`measure` function**: Uses `process.hrtime()` causing white screen in browsers
2. **`testUtils`**: Imports `node:assert` which is Node.js-specific
3. **General environment assumptions**: Package assumes Node.js environment

## Impact

- PVM debugger adapter had to switch from wildcard exports to explicit named exports (PR #442)  
- Any browser-based usage of packages importing `@typeberry/utils` fails
- Workarounds like explicit exports are fragile and don't solve root cause

## Solution

`@typeberry/utils` should be refactored to work in all environments:

1. **Conditional imports/exports**: Separate browser and Node.js specific utilities
2. **Environment detection**: Proper feature detection instead of assuming `process` exists
3. **Alternative implementations**: Browser-compatible alternatives for Node.js-specific APIs
4. **Testing**: Ensure package works in both Node.js and browser environments

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/442
- Discussion: https://github.com/FluffyLabs/typeberry/pull/442#discussion_r2154668266

CC: @tomusdrw @mateuszsikora


## Comment by @tomusdrw

Fixed in #852 
