---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/80'
title: Add shouldPanic support to test framework
site: github.com/tomusdrw/as-lan
created_at: '2026-04-03T21:32:46.000Z'
last_modified: '2026-04-03T21:32:46.000Z'
content_kind: issue
---

# Add shouldPanic support to test framework

## Issue by @tomusdrw

## Problem

The test framework (`sdk/test/utils.ts`) has no way to assert that a function call panics. Since `panic()` calls `abort()` which traps the WASM, the test runner crashes with no recovery.

This makes it impossible to test failure paths like the authorizer example's `panic("Authorization failed")` when token != config.

## Proposed solution

Add a `shouldPanic` (or `expectAbort`) test variant that runs the test function in a way that expects it to trap. Two possible approaches:

1. **JS-side catch**: The test runner (`bin/test.js`) could catch the WASM trap exception and treat it as a pass. This would require a new test type (e.g. `testPanic("name", fn)`) that the runner recognizes and wraps in a try/catch.

2. **Separate WASM instantiation**: Run the panicking test in a fresh WASM instance so the trap doesn't corrupt state for subsequent tests. More robust but heavier.

Option 1 is likely sufficient — WASM traps unwind cleanly and the linear memory remains intact for subsequent tests.

## Example usage

```typescript
export const TESTS: Test[] = [
  testPanic("authorize panics on token mismatch", () => {
    TestEcalli.reset();
    TestFetch.setDataForKind(8, encodeAuthorizerInfo(strToBytes("aaa")));
    TestFetch.setDataForKind(9, strToBytes("bbb"));
    callAuthorize(0); // should panic
  }),
];
```

## Context

Came up while building the authorizer example (`examples/authorizer/`). The `authorize` entry point panics when the authorization token doesn't match the config, and we currently can't test that path.
