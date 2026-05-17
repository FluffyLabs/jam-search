---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/refine.md#L206-L235
title: docs/src/sdk-api/refine.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 4b6c0b014e018a560d37a9f937072069581cc9e028164158255e6741583118cf
language: markdown
---
`docs/src/sdk-api/refine.md` (lines 206–235)

```markdown
  exceeding `SPI_MAX_ARGS_LEN`, or invalid entry point. Use this for
  trusted blobs (embedded at build time, produced by the outer runtime).
- **`NestedPvm.fromSpiChecked(blob, args, gas)`** — Same setup, but returns
  `ResultN<NestedPvm, SpiError>` instead of panicking. Use this for blobs
  loaded from an untrusted source (preimage, peer). `SpiError` covers
  `MalformedBlob`, `TrailingBytes`, `ArgsTooLarge`, `InvalidEntryPoint`.
- **`vm.invoke()`** — Run the inner PVM. Returns an `ExitReason`. Updates
  gas and registers in place.
- **`vm.getExitArg()`** — Most recent `r8` — host-call index on `Host`,
  fault address on `Fault`, undefined for the other exit reasons.
- **`vm.getRegister(i)`** / **`vm.setRegister(i, v)`** — Read / write r0..r12.
- **`vm.remainingGas()`** / **`vm.setGas(g)`** — Read / top up the gas budget
  between invokes.
- **`vm.peek(src, dest)`** / **`vm.poke(dest, data)`** — Read / write inner
  memory outside an invoke. Returns `ResultN<bool, OutOfBounds>`.
- **`vm.expunge()`** — Destroy the inner machine. Returns the host
  expunge value (`i64`).

### SPI memory layout constants

Exposed for reference; rarely needed directly.

| Constant | Value | Notes |
| --- | --- | --- |
| `SPI_PAGE_SIZE` | `2^12` | Z_P — 4 KiB |
| `SPI_SEGMENT_SIZE` | `2^16` | Z_Z — 64 KiB |
| `SPI_MAX_ARGS_LEN` | `2^24` | Z_I — 16 MiB |
| `SPI_RO_START` | `0x0001_0000` | Start of read-only data |
| `SPI_STACK_SEGMENT_END` | `0xFEFE_0000` | Top of stack region |
| `SPI_ARGS_SEGMENT_START` | `0xFEFF_0000` | Start of args region |
```
