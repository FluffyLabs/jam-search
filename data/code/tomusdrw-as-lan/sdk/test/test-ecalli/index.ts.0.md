---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/index.ts#L1-L35
title: sdk/test/test-ecalli/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 253e2e796594db393728b04abaeefac701a49db62731e50826c5ea432bbcbc3a
language: typescript
---
`sdk/test/test-ecalli/index.ts` (lines 1–35)

```typescript
// AS-side wrappers for configuring test ecalli stubs.
//
// These static classes provide a high-level API for AssemblyScript test code
// to configure the stub behavior at runtime (e.g. TestGas.set(500) changes
// the value returned by the gas() ecalli).
//
// Each class bridges to the JS-side stub implementation in sdk-ecalli-mocks/
// via @external("ecalli", ...) WASM imports. For example, TestGas.set()
// calls setGasValue() exported by sdk-ecalli-mocks/src/gas.ts.

export { TestAccumulate } from "./accumulate";
export { TestExportSegment } from "./export-segment";
export { TestGas } from "./gas";
export { TestFetch } from "./fetch";
export { TestHistoricalLookup } from "./historical-lookup";
export { TestInfo } from "./info";
export { TestLookup } from "./lookup";
export { TestPreimages } from "./preimages";
export { TestMachine } from "./machines";
export { TestPrivileged } from "./privileged";
export { TestServices } from "./services";
export { TestStorage } from "./storage";
export { TestTransfer } from "./transfer";

// @ts-expect-error: decorator
@external("ecalli", "resetAll")
declare function _resetAll(): void;

/** Top-level test ecalli utilities. */
export class TestEcalli {
  /** Reset all test ecalli configuration to defaults and clear storage. */
  static reset(): void {
    _resetAll();
  }
}
```
