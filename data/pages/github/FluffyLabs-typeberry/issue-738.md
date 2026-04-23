---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/738'
title: Run W3F PVM tests on Ananas interpreter
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-26T09:59:12.000Z'
last_modified: '2025-10-26T09:59:12.000Z'
content_kind: issue
---

# Run W3F PVM tests on Ananas interpreter

## Issue by @coderabbitai[bot]

The W3F PVM test suite in `bin/test-runner/w3f/pvm.ts` currently only runs on the built-in interpreter. With the addition of Ananas PVM interpreter support in #716, these tests should also be executed on the Ananas backend to ensure compatibility and correctness.

**Context:**
- Related PR: https://github.com/FluffyLabs/typeberry/pull/716
- Comment: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2463608026
- Requested by: @tomusdrw

**Tasks:**
- Extend the W3F PVM test runner to support running tests on both Built-in and Ananas interpreters
- Ensure all tests pass on both backends
- Add appropriate test coverage for the Ananas backend


## Comment by @tomusdrw

Done in #716 
