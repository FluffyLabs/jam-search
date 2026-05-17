---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/testing.md#L1-L117'
title: docs/src/testing.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 9837915beee486dd9ce48c608bb4ffd6208515154b7bfaf0da919249539e5e8e
language: markdown
---
`docs/src/testing.md` (lines 1–117)

```markdown
# Testing

The SDK provides a test framework for writing and running AssemblyScript tests
against your JAM service, with configurable ecalli host call mocks.

## Architecture

Testing involves two layers that work together:

```text
┌─────────────────────────────────────┐
│  AssemblyScript test code (WASM)    │
│                                     │
│  ┌───────────┐  ┌────────────────┐  │
│  │ Your test │  │ SDK test utils │  │
│  │ assertions│  │ TestGas, etc.  │  │
│  └───────────┘  └───────┬────────┘  │
│                         │           │
│         @external("ecalli", ...)    │
└─────────────────────────┼───────────┘
                          │ WASM imports
┌─────────────────────────┼───────────┐
│  sdk-ecalli-mocks (Node.js)         │
│                                     │
│  Stub implementations of ecalli     │
│  host calls + configuration state   │
└─────────────────────────────────────┘
```

- **`sdk-ecalli-mocks/`** — A TypeScript (Node.js) package that provides stub
  implementations of all 27 ecalli host calls (general 0-5 + 100, refine 6-13,
  accumulate 14-26). These stubs satisfy the WASM imports at test time and hold
  configurable state (gas value, storage map, preimage data, etc.).

- **`sdk/test/test-ecalli/`** — AssemblyScript wrapper classes (`TestGas`,
  `TestFetch`, `TestLookup`, `TestStorage`, `TestEcalli`) that bridge to the
  JS-side stubs via `@external("ecalli", ...)` WASM imports. These give your
  AS test code a high-level API for configuring stub behavior.

## Writing Tests

### Test structure

Tests use the `test()` helper and `Assert` class from the SDK:

```typescript
import { Assert, Test, test } from "@fluffylabs/as-lan/test";

export const TESTS: Test[] = [
  test("my feature works", () => {
    const assert = Assert.create();
    assert.isEqual(1 + 1, 2, "basic math");
    return assert;
  }),
];
```

Each test function returns an `Assert` instance. Use `assert.isEqual(actual, expected, msg)`
to add assertions — any failure is recorded and reported after the test completes.

### Test runner

Each service needs a `test-run.ts` entry point that registers test suites:

```typescript
import { TestSuite, runTestSuites } from "@fluffylabs/as-lan/test";
import * as myTests from "./index.test";

export function runAllTests(): void {
  runTestSuites([TestSuite.create(myTests.TESTS, "my-service.ts")]);
}
```

And a `bin/test.js` that boots the WASM and runs:

```javascript
import { setMemory } from "ecalli";
import { memory, runAllTests } from "../build/test.js";

setMemory(memory);
runAllTests();
```

### Build and run

```bash
npm test   # compiles test target and runs bin/test.js
```

This compiles your test-run entry point to WASM (with the `test` target from
`asconfig.json`), then executes it in Node.js with the ecalli stubs providing
host call implementations.

### Invoking your service

`RefineCall` and `AccumulateCall` are chainable builders that encode the
matching args struct, invoke your service entrypoint, and decode the result.
Defaults cover the common case; override individual fields with `with*`
setters as needed.

```typescript
import { BytesBlob } from "@fluffylabs/as-lan";
import { AccumulateCall, RefineCall } from "@fluffylabs/as-lan/test";
import { accumulate, refine } from "./my-service";

// Refine: defaults coreIndex=0, itemIndex=0, serviceId=42, workPackageHash=zeros.
// Returns the decoded `Response` (assumes the service uses `Response.with(...)`
// or `ctx.respond(...)`).
const resp = RefineCall.create()
  .withServiceId(10)
  .call(refine, BytesBlob.parseBlob("0xdeadbeef").okay!);
assert.isEqualBytes(resp.data, expected, "refine output");

// Accumulate: defaults slot=7, serviceId=42. The second arg to `.call()` is
// the number of items the service should fetch via `fetch(kind=15, i)` —
// seed each one beforehand with `TestAccumulate.setItem(i, ...)`.
// Returns raw response bytes (since accumulate response shape varies:
```
