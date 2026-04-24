---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/common.md#L1-L68'
title: docs/src/sdk-api/common.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 64577461607fb8e4d6ae8d9f57cdc92605c2b41440527397077428c7804e4641
language: markdown
---
`docs/src/sdk-api/common.md` (lines 1–68)

```markdown
# Common (All Contexts)

These wrappers are available in all invocation contexts (refine, accumulate, authorize).

## Gas

All context classes expose `remainingGas()` which returns the gas remaining
after the call (ecalli 0):

```typescript
const gasLeft = ctx.remainingGas();  // i64
```

## Service Data

High-level wrappers for service storage (`read`/`write`) and account info (`info`).

```typescript
// Read/write access to the current service (preferred)
const storage = ctx.serviceData();
const info = storage.info();                  // Optional<AccountInfo>
const val = storage.read(key);               // key: BytesBlob → Optional<BytesBlob>
const result = storage.write(key, value);    // key/value: BytesBlob → Result<OptionalN<u64>, WriteError>

// Read-only access to another service by ID
const other = ServiceData.create(42);
const otherInfo = other.info();
```

## Preimages

Wraps the `lookup` ecalli with buffer management and auto-expansion.
Each context provides the appropriate preimage helper via `ctx.preimages()`.

```typescript
const preimages = ctx.preimages();  // Preimages, RefinePreimages, or AccumulatePreimages
const hash = Bytes32.zero();  // or a real hash
const result = preimages.lookup(hash);  // Optional<BytesBlob>
if (result.isSome) {
  const data = result.val!;
  // use data...
}

// Look up a preimage for a different service:
const other = preimages.lookup(hash, 42);
```

Context-specific extensions (`RefinePreimages`, `AccumulatePreimages`) are
documented under their respective context pages.

## Cryptography

Pure-AssemblyScript crypto primitives. These compile to the PVM target with
no host-call dependencies.

### Blake2b-256

RFC 7693 Blake2b, unkeyed, 32-byte output — the JAM preimage hash.

```typescript
import { blake2b256 } from "@fluffylabs/as-lan";

const digest = blake2b256(payload);  // Uint8Array(32)
```

The implementation supports a single input up to 2⁶⁴ − 1 bytes (the high 64
bits of the RFC 7693 counter are hardcoded to zero). Chained hashing of
arbitrarily long streams is out of scope.
```
