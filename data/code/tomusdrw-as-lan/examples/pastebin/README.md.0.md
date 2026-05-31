---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/README.md#L1-L86
title: examples/pastebin/README.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 05634cc4709294d890a6d9f56984c5f076f238ebff3465180860e6da1011e5bc
language: markdown
---
`examples/pastebin/README.md` (lines 1–86)

```markdown
# Pastebin example

Open-submission pastebin service. Anyone submits a blob; the service
Blake2b-256-hashes it in refine, solicits the preimage in accumulate, and
expires pastes after `TTL_SLOTS` slots.

## Design

- **Refine**: Blake2b-256 the full payload, emit `hash ‖ length_LE` as the
  operand `okBlob` (36 bytes total).
- **Accumulate**: idempotent insert — skip if `paste:<hash>` already exists;
  otherwise `solicit(hash, length)`, write `PasteEntry` metadata, push to
  the `recent:` ring buffer, and append the hash to the `expiry:<slot+TTL>`
  bucket. Cleanup runs once per invocation and walks up to
  `CLEANUP_SLOTS_PER_CALL` expiry buckets forward from `meta:cleanup_cursor`,
  forgetting expired pastes and deleting their metadata.
- **Preimage delivery**: out-of-band via the `xtpreimages` block extrinsic
  plus CE 142 gossip. The service never calls `provide`.
- **Self-authorizing dispatch**: `index.ts` routes on input length using
  the SDK helper `isRefineArgs(len)` — refine if true, `is_authorized`
  (2-byte u16 core index) otherwise.

## Storage layout

| Key | Value |
|---|---|
| `paste:<32-byte hash>` | `PasteEntry` (8 bytes: slot u32 LE ‖ length u32 LE) |
| `recent:<u32 LE idx>` | Ring-buffer entry: `hash ‖ slot_LE` (36 bytes), `idx = head mod RECENT_N` |
| `expiry:<u32 LE slot>` | Packed 32-byte hashes scheduled to expire at `slot` |
| `meta:recent_head` | Ring-buffer head counter (u32 LE) |
| `meta:cleanup_cursor` | Highest slot whose expiry bucket has been swept (u32 LE) |

Constants live in `assembly/constants.ts`: `TTL_SLOTS = 1000`, `RECENT_N = 32`,
`CLEANUP_SLOTS_PER_CALL = 8`.

## Build + test

```bash
npm install
npm run build      # debug + release + PVM
npm test
```

`npm test` runs the AS test harness against 9 pastebin integration tests
covering refine output (non-empty + empty payload), accumulate insertion,
idempotent re-submission, TTL cleanup, multi-hash shared-bucket cleanup,
solicit-failure gating, self-authorizing dispatch routing, and the
end-to-end solicit → extrinsic-delivery → lookup flow. Blake2b-256 RFC
test vectors live with the implementation under `sdk/core/crypto/` and
run as part of the SDK suite.

## Customizing for your service

This example is a template for any service that follows the "hash in refine,
solicit in accumulate, age out via TTL" pattern. Three natural customization
points:

1. **`assembly/constants.ts`** — TTL, recent-ring size, and cursor step:
   - `TTL_SLOTS` controls how long a paste lives before cleanup reclaims it.
   - `RECENT_N` controls the ring-buffer window for "N most recent" reads.
   - `CLEANUP_SLOTS_PER_CALL` bounds per-call cleanup work; lower = smoother
     gas usage per call but slower catch-up on large backlogs.

2. **`assembly/refine.ts`** — payload shape and hash algorithm:
   - Change `blake2b256(args.payload.raw)` if you need a different hash.
   - Add payload validation (max size, format check) before hashing and
     return a non-zero `Response.with(error)` to signal rejection. Refine
     output shape (`hash ‖ length_LE`, 36 B) is the contract accumulate
     reads — keep it stable or update both sides together.

3. **`assembly/authorize.ts`** — gating policy:
   - Currently `is_authorized` accepts every payload. To gate by core index,
     use the returned `CoreIndex` from `ctx.parseCoreIndex` and return
     `Response.with(nonZero)` for rejected cores.
   - To add rate-limiting, pair this with an `authorize:<coreIndex>` storage
     key tracking recent submission counts. Note: `is_authorized` runs
     pre-refine and has restricted SDK access (see
     `docs/src/sdk-api/authorize.md`).

## Limitations (v1)

- **No authentication**: anyone can submit. The service pays all storage
  costs.
- **No rate limit**: a flood can fill the recent-ring buffer in 32 slots.
- **First-writer-wins idempotency**: re-submitting the same hash silently
  preserves the original slot rather than refreshing the TTL.
```
