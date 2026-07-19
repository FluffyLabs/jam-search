---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api.md#L1-L53'
title: docs/src/sdk-api.md
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b42a369e9e776e1149a8c2a8e4a78eef2f7c0f9e0af3b65996c71f0f02b3a86f
language: markdown
---
`docs/src/sdk-api.md` (lines 1–53)

```markdown
# SDK API

The SDK API is organized by invocation context — each page documents the
wrappers available during that entry point.

- [Common](./sdk-api/common.md) — available in all contexts (ServiceData, Preimages)
- [Refine](./sdk-api/refine.md) — RefineContext, RefineFetcher, RefinePreimages, Machine
- [Accumulate](./sdk-api/accumulate.md) — AccumulateContext, AccumulateFetcher, AccumulatePreimages
- [Authorize](./sdk-api/authorize.md) — AuthorizeContext, AuthorizeFetcher
- [Utilities](./sdk-api/utilities.md) — Logger, LogMsg, ByteBuf, Decoder, Byte Types
- [Host Calls (ecalli)](./sdk-api/ecalli.md) — raw host call reference table

The test-time SDK surface (under `@fluffylabs/as-lan/test`) is documented
on the [Testing](./testing.md) page. It includes:

- `RefineCall` / `AccumulateCall` — chainable builders that encode args and
  invoke a service entrypoint.
- `OperandItem` / `TransferItem` — chainable builders for the encoded
  `AccumulateItem` blobs that `TestAccumulate.setItem(i, ...)` expects.
- `Assert`, `Test`, `TestSuite`, `runTestSuites`, `unpackResult`,
  `strBlob` — the test framework primitives.
- `TestEcalli`, `TestGas`, `TestFetch`, `TestLookup`, `TestStorage`,
  `TestAccumulate`, `TestPreimages`, `TestPrivileged`, `TestServices`,
  `TestMachine`, `TestExportSegment`, `TestHistoricalLookup`,
  `TestTransfer`, `TestInfo` — mock-stub configuration classes.

## Example services

Each example in `examples/` is a self-contained service that exercises a
particular slice of the SDK. Browse the source for end-to-end patterns.

- **[fibonacci](https://github.com/tomusdrw/as-lan/tree/main/examples/fibonacci)**
  — minimal refine + accumulate, starter template.
- **[authorizer](https://github.com/tomusdrw/as-lan/tree/main/examples/authorizer)**
  — standalone `is_authorized` service with gating logic.
- **[ecalli-test](https://github.com/tomusdrw/as-lan/tree/main/examples/ecalli-test)**
  — dispatches every ecalli host call for smoke-testing the SDK surface.
- **[all-ecalli](https://github.com/tomusdrw/as-lan/tree/main/examples/all-ecalli)**
  — self-authorizing service that invokes every ecalli across refine,
  accumulate, and authorize entry points.
- **[pastebin](https://github.com/tomusdrw/as-lan/tree/main/examples/pastebin)**
  — open-submission paste service. Refine hashes the payload with
  Blake2b-256; accumulate solicits the preimage and records metadata in a
  storage-backed ring buffer plus a slot-bucketed TTL index. Preimage bytes
  arrive via the `xtpreimages` block extrinsic — accumulate never calls
  `provide`. Good reference for the solicit-only preimage lifecycle and
  slot-bucket cleanup patterns.
- **[library](https://github.com/tomusdrw/as-lan/tree/main/examples/library)**
  — hosts reusable PVM verification blobs as SPI-encoded preimages keyed
  by name, resolved and executed via `ctx.nestedPvmFromSpiChecked(...)`.
- **[nested-pvm-spi](https://github.com/tomusdrw/as-lan/tree/main/examples/nested-pvm-spi)**
  — minimal smoke test for the inner PVM: loads an embedded SPI blob and
  runs it through `ctx.nestedPvmFromSpiChecked`.
```
