---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/testing.md#L1-L139'
title: docs/src/testing.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 5
content_sha: a202370eb1d8d592b320e0632c0edcbf3f662f126a58fa0ebc92ec9308b5008f
language: markdown
---
`docs/src/testing.md` (lines 1–139)

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

## Configuring Ecalli Mocks

By default the stubs provide sensible test values (e.g. `gas()` returns
`1_000_000`, `lookup()` returns `"test-preimage"`, `read()`/`write()` use an
in-memory Map). You can override these from within your AS test code.

### TestGas

Set the value returned by the `gas()` ecalli:

```typescript
import { TestGas } from "@fluffylabs/as-lan/test";

TestGas.set(500);  // gas() will now return 500
```

### TestFetch

Set fixed data returned by the `fetch()` ecalli (overrides the default
kind-dependent pattern):

```typescript
import { TestFetch } from "@fluffylabs/as-lan/test";

const data = new Uint8Array(4);
data[0] = 0xde; data[1] = 0xad; data[2] = 0xbe; data[3] = 0xef;
TestFetch.setData(data);
```

### TestLookup

Set the preimage returned by the `lookup()` ecalli:

```typescript
import { TestLookup } from "@fluffylabs/as-lan/test";

const preimage = new Uint8Array(3);
preimage[0] = 1; preimage[1] = 2; preimage[2] = 3;
TestLookup.setPreimage(preimage);

// Make lookup return NONE (preimage not found)
TestLookup.setNone();
```

#### Simulating extrinsic-driven preimage delivery

```
