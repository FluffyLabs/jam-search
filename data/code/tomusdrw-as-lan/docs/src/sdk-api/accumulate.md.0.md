---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/accumulate.md#L1-L111
title: docs/src/sdk-api/accumulate.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: d8eeff774909b3cd5c2c04489ef88013e277dbe68effc190b347852099c65959
language: markdown
---
`docs/src/sdk-api/accumulate.md` (lines 1–111)

```markdown
# Accumulate

Wrappers available during the `accumulate` entry point.

## AccumulateContext

Parses arguments and provides accumulate-specific convenience methods.
It also serves as the entry point for creating all accumulate-context helpers
via factory methods — **prefer `ctx.*()` over standalone `*.create()`**.

```typescript
import { AccumulateContext, Bytes32, BytesBlob, Memo } from "@fluffylabs/as-lan";

export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  // args.slot, args.serviceId, args.argsLength

  const gasLeft = ctx.remainingGas();    // i64 — ecalli 0
  const gas = ctx.checkpoint();          // i64 — commit state, return remaining gas

  // ecalli 25 — publish the accumulation result hash (side effect, no return).
  ctx.yieldResult(Bytes32.zero());

  // Create helpers via the context
  const fetcher = ctx.fetcher();         // AccumulateFetcher
  const preimages = ctx.preimages();     // AccumulatePreimages
  const storage = ctx.serviceData();     // CurrentServiceData
  const admin = ctx.admin();             // Admin
  const cs = ctx.childServices();        // ChildServices
  const self = ctx.selfService();        // SelfService

  // Schedule a transfer (executes after accumulation completes)
  const r1 = ctx.scheduleTransfer(42, 1000, 100);  // ResultN<bool, TransferError>

  // Transfer with explicit memo
  const memo = Memo.create(BytesBlob.encodeAscii("hello"));
  const r2 = ctx.scheduleTransfer(42, 1000, 100, memo);

  // Encode the entry-point return value: Optional<CodeHash> (null = no upgrade).
  return ctx.yieldHash(null);
}
```

**`ctx.remainingGas()`** — return the remaining gas (ecalli 0).

**`ctx.fetcher(bufSize?)`** — create an `AccumulateFetcher` (fetch kinds 0-1, 14-15).

**`ctx.preimages(bufSize?)`** — create an `AccumulatePreimages` helper (lookup + lifecycle).

**`ctx.serviceData(bufSize?)`** — create a `CurrentServiceData` helper for storage read/write.

**`ctx.admin()`** — create an `Admin` helper for privileged governance.

**`ctx.childServices()`** — create a `ChildServices` helper for child service lifecycle.

**`ctx.selfService()`** — create a `SelfService` helper for self-management.

## AccumulateFetcher

Fetches context data (fetch kinds 0-1, 14-15): protocol constants, entropy,
and accumulate items (operands and transfers).

```typescript
const fetcher = ctx.fetcher();
const items = fetcher.allTransfersAndOperands();
const one = fetcher.oneTransferOrOperand(0);  // Optional<AccumulateItem>
```

## AccumulatePreimages

Extends base `Preimages` with preimage lifecycle management (ecalli 22-26).

```typescript
const preimages = ctx.preimages();

// Look up
const data = preimages.lookup(hash);  // Optional<BytesBlob>

// Query status of a solicited preimage
const status = preimages.query(hash, 64);  // Optional<PreimageStatus>
if (status.isSome) {
  const s = status.val!;
  if (s.kind === PreimageStatusKind.Available) {
    // s.slot0 = timeslot when it became available
  }
}

// Solicit a preimage (request it be made available)
const r1 = preimages.solicit(hash, 64);  // ResultN<bool, SolicitError>

// Forget a solicitation
const r2 = preimages.forget(hash, 64);   // ResultN<bool, ForgetError>

// Provide a preimage to a service
const r3 = preimages.provide(BytesBlob.wrap(data));  // ResultN<bool, ProvideError>
```

**`PreimageStatus`** — returned by `query()`. A tagged value with `kind` and
up to 3 timeslot fields:

| Kind | Fields | Meaning |
|------|--------|---------|
| `Requested` | — | Solicited but not yet available |
| `Available` | `slot0` | Currently available (added at slot0) |
| `Unavailable` | `slot0`, `slot1` | Was available, now removed |
| `Reavailable` | `slot0`, `slot1`, `slot2` | Removed then re-added |

## Admin (Privileged Governance)

High-level wrappers for ecallis 14-16 (`bless`, `assign`, `designate`). Only
```
