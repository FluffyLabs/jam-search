---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L153-L213'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 3
chunk_total: 6
content_sha: 26b34a5b2ee33ff0b449c9f7a133080d73777f6c232e26015f330b038ed1ba59
language: markdown
---
`CLAUDE.md` (lines 153–213)

```markdown
  return ctx.respond(result, data);
}
```

All contexts expose `remainingGas(): i64` (ecalli 0) and factory methods for creating
context-appropriate helpers. **Prefer `ctx.*()` over standalone `*.create()`.**

Contexts:
- **AccumulateContext** — `parseArgs()`, `respond()`, `yieldHash()`, `checkpoint()`, `yieldResult()`, `scheduleTransfer()`, `remainingGas()`, factories: `fetcher()`, `preimages()`, `serviceData()`, `admin()`, `childServices()`, `selfService()`, accumulate codecs
- **RefineContext** — `parseArgs()`, `respond()`, `exportSegment()`, `remainingGas()`, factories: `fetcher()`, `preimages()`, `serviceData()`, `machine(code, entrypoint)`, `nestedPvmFromSpi(blob, args, gas)`, `nestedPvmFromSpiChecked(blob, args, gas)`, refine codecs
- **AuthorizeContext** — `parseCoreIndex(ptr, len)` returns `CoreIndex` (u16), `remainingGas()`, factories: `fetcher()`, `preimages()`, `serviceData()`. No codec state.

### Service ABI Types (sdk/jam/service.ts)

- **RefineArgs / AccumulateArgs**: Pure data classes. Parse via `ctx.parseArgs(ptr, len)` (panics on invalid data).
- **Response**: Use `Response.with(result, data?)` for quick ptrAndLen encoding. Decode via `ctx.response`.

### Fetcher Hierarchy (sdk/jam/)

High-level wrappers around the raw `fetch` ecalli (Ω_Y, GP Appendix B.5).
Create fetchers via `ctx.fetcher()` on the appropriate context, or directly via `*.create(bufSize?)`.

Methods that fetch **non-indexed, always-present** data return `T` directly and
panic if the host returns NONE (host-contract violation). Methods that fetch
**indexed** data (where the index may be out of bounds) return `T | null`.

```text
Fetcher primitives (fetchRaw, fetchRawOrPanic, fetchBlob, fetchBlobOrPanic, fetchAndDecode, fetchAndDecodeOptional)
  ├── WorkPackageFetcher (kinds 0, 7-13: constants, WorkPackage, etc.)
  │     ├── AuthorizeFetcher (kinds 0, 7-13) — ctx.fetcher() on AuthorizeContext
  │     └── RefineFetcher (adds entropy, trace, extrinsics, imports — kinds 0-13) — ctx.fetcher() on RefineContext
  └── AccumulateFetcher (kinds 0-1, 14-15: constants, entropy, accumulate items) — ctx.fetcher() on AccumulateContext
```

GP fetch parameter mapping per context (eq B.1, B.6, B.11):
- **Is-Authorized**: `Ω_Y(ρ, φ, μ, 𝐩, ∅, ∅, ∅, ∅, ∅, ∅, ∅)` → p set, rest ∅
- **Refine**: `Ω_Y(ρ, φ, μ, p, H₀, r, i, ī, x̄, ∅, (m,e))` → all except 𝐢
- **Accumulate**: `Ω_Y(ρ, φ, μ, ∅, η'₀, ∅, ∅, ∅, ∅, 𝐢, (x,y))` → n and 𝐢 only

### ServiceData (sdk/jam/service-data.ts)

High-level wrappers for service storage (`read`/`write` ecallis) and account info (`info` ecalli).

- **ServiceData** — read-only access to any service by ID. Methods: `info()` → `Optional<AccountInfo>`, `read(key)` → `Optional<BytesBlob>`.
- **CurrentServiceData** extends ServiceData — adds `write(key, value)` → `Result<OptionalN<u64>, WriteError>` for the current service (uses `u32.MAX_VALUE` as service ID).
- Both manage an internal reusable buffer with auto-expansion (same pattern as `FetchBuffer`).
- `info()` panics on decode failure (host-contract violation). `read()` returns `Optional.none` for missing keys. `write()` returns `WriteError.Full` when storage quota is exceeded.

### Preimages (sdk/jam/preimages.ts, sdk/jam/\*/preimages.ts)

High-level wrappers for preimage ecallis (`lookup`, `historical_lookup`, `query`, `solicit`, `forget`, `provide`).
Uses composition (not inheritance) following the Fetcher pattern. Each class manages its own internal buffer with auto-expansion.

```text
Preimages (ecalli 2: lookup)
  ├── RefinePreimages  (composes Preimages, adds ecalli 6: historicalLookup)
  └── AccumulatePreimages (composes Preimages, adds ecalli 22-26: query, solicit, forget, provide)
```

- **Preimages** — `lookup(hash, serviceId?)` → `Optional<BytesBlob>`. Available in all contexts.
- **RefinePreimages** — adds `historicalLookup(hash, serviceId?)` → `Optional<BytesBlob>`.
```
