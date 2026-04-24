---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api.md#L1-L39'
title: docs/src/sdk-api.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: cfc04327f7d0ce27928d06cbdbfde1478183e298ca11c2c41a750dd31ecce770
language: markdown
---
`docs/src/sdk-api.md` (lines 1–39)

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
