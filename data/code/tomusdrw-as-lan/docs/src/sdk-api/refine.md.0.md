---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/refine.md#L1-L118
title: docs/src/sdk-api/refine.md
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: de42beef34f399c2b84259656f0ff95e4dd42eaffe77fabccce9bed6e3c0e6e8
language: markdown
---
`docs/src/sdk-api/refine.md` (lines 1–118)

```markdown
# Refine

Wrappers available during the `refine` entry point.

## RefineContext

Parses arguments and provides refine-specific convenience methods.
It also serves as the entry point for creating all refine-context helpers
via factory methods — **prefer `ctx.*()` over standalone `*.create()`**.

```typescript
import { RefineContext } from "@fluffylabs/as-lan";

export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  // args.coreIndex, args.itemIndex, args.serviceId, args.payload, args.workPackageHash

  const gasLeft = ctx.remainingGas();  // i64 — ecalli 0

  const fetcher = ctx.fetcher();       // RefineFetcher
  const preimages = ctx.preimages();   // RefinePreimages
  const storage = ctx.serviceData();   // CurrentServiceData

  return args.payload.toPtrAndLen();
}
```

**`ctx.remainingGas()`** — return the remaining gas (ecalli 0).

**`ctx.fetcher(bufSize?)`** — create a `RefineFetcher` (fetch kinds 0-13).

**`ctx.preimages(bufSize?)`** — create a `RefinePreimages` helper (lookup + historicalLookup).

**`ctx.serviceData(bufSize?)`** — create a `CurrentServiceData` helper for storage read/write.

**`ctx.machine(code, entrypoint)`** — create an inner PVM `Machine` (ecalli 8).
Returns `ResultN<Machine, InvalidEntryPoint>`.

**`ctx.nestedPvmFromSpi(blob, args, gas)`** — decode an SPI blob and set up an
inner PVM ready to invoke. Returns a `NestedPvm`. Panics on malformed blob.
See the `NestedPvm` section below.

**`ctx.nestedPvmFromSpiChecked(blob, args, gas)`** — same setup, but returns
`ResultN<NestedPvm, SpiError>` instead of panicking. Prefer for preimages or
other untrusted input.

**`ctx.exportSegment(segment)`** — export a data segment (ecalli 7). Returns
the segment index on success, or `ExportSegmentError.Full` when the limit is reached.

```typescript
const segment = BytesBlob.wrap(data);
const result = ctx.exportSegment(segment);  // ResultN<u32, ExportSegmentError>
if (result.isOkay) {
  const index = result.okay;  // segment index
}
```

## RefineFetcher

Fetches context data (fetch kinds 0-13): protocol constants, work package,
entropy, authorizer trace, extrinsics, imports, and work item payloads.

```typescript
const fetcher = ctx.fetcher();
const wp = fetcher.workPackage();
const entropy = fetcher.entropy();
const payload = fetcher.workItemPayload(0);  // Optional<BytesBlob>
```

## RefinePreimages

Extends base `Preimages` with `historicalLookup` (ecalli 6) for querying
historical state during refinement.

```typescript
const preimages = ctx.preimages();
const current = preimages.lookup(hash);              // Optional<BytesBlob>
const historical = preimages.historicalLookup(hash);  // Optional<BytesBlob>
```

## Machine (Inner PVM)

High-level wrapper for creating and running inner PVM machines (ecalli 8-13).

```typescript
import { Machine, InvokeIo, ExitReason, PageAccess, BytesBlob } from "@fluffylabs/as-lan";

const code: BytesBlob = /* PVM bytecode */;
const result = Machine.create(code, 0);
if (result.isError) { /* InvalidEntryPoint */ return; }
const machine = result.okay!;

// Set up memory pages and write data
machine.pages(0, 1, PageAccess.ReadWrite);
machine.poke(0, myData);

// Run with host-call loop
const io = InvokeIo.create(1_000_000);
io.setRegister(7, someArg);

let outcome = machine.invoke(io);
while (outcome.reason == ExitReason.Host) {
  // Handle host call (outcome.r8 = host call index)
  outcome.io.setRegister(7, responseValue);
  outcome = machine.invoke(outcome.io);
}

// Read results and clean up
const buf = BytesBlob.zero(32);
machine.peek(0, buf);
const hash = machine.expunge();
```

### Machine API

- **`Machine.create(code, entrypoint)`** — Create inner PVM. Returns `ResultN<Machine, InvalidEntryPoint>`.
- **`machine.peek(source, dest)`** — Read from inner machine memory. Returns `ResultN<bool, OutOfBounds>`.
```
