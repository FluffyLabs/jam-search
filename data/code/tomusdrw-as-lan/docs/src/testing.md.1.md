---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/testing.md#L131-L257'
title: docs/src/testing.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 5
content_sha: e2080c5d487527fbba8a790924809902f3350d0c09fead57ccd0273ff7f683b4
language: markdown
---
`docs/src/testing.md` (lines 131–257)

```markdown
preimage[0] = 1; preimage[1] = 2; preimage[2] = 3;
TestLookup.setPreimage(preimage);

// Make lookup return NONE (preimage not found)
TestLookup.setNone();
```

#### Simulating extrinsic-driven preimage delivery

In production, preimages arrive out-of-band via the `xtpreimages` block
extrinsic and CE 142 gossip — a service that only calls `solicit()` (never
`provide()`) still sees the preimage become available once the network
delivers it. To exercise that path in tests without modeling block
inclusion, attach the preimage directly to the `lookup()` mock:

```typescript
import { Bytes32, BytesBlob } from "@fluffylabs/as-lan";
import { TestLookup } from "@fluffylabs/as-lan/test";

// After this call, any lookup(hash) ecalli returns `preimage`.
TestLookup.setAttachedPreimage(
  Bytes32.wrapUnchecked(hashBytes),
  BytesBlob.wrap(preimageBytes),
);

// Clear all attached preimages (keeps the single-preimage fallback).
TestLookup.clearAttachedPreimages();
```

Attached entries take precedence over `setPreimage` / `setNone`. Both
`TestEcalli.reset()` and any `resetPreimages`/`resetLookup` path clear
the attached map, so tests starting with `TestEcalli.reset()` never see
leaked attachments from a prior test.

Good reference: the `pastebin` example's `"paste → solicit → attach → lookup
retrieves blob"` test exercises the full flow end-to-end.

### TestHistoricalLookup

Set the preimage returned by the `historical_lookup()` ecalli (refine context):

```typescript
import { TestHistoricalLookup } from "@fluffylabs/as-lan/test";

TestHistoricalLookup.setPreimage(data);

// Make historical_lookup return NONE
TestHistoricalLookup.setNone();
```

### TestPreimages

Configure accumulate-context preimage ecalli stubs (query, solicit, forget, provide):

```typescript
import { TestPreimages } from "@fluffylabs/as-lan/test";
import { EcalliResult } from "@fluffylabs/as-lan";

// Configure query to return "Available" with slot0=42:
// r7 = (slot0 << 32) | kind, r8 = (slot2 << 32) | slot1
TestPreimages.setQueryResult(i64((u64(42) << 32) | 1), 0);

// Configure query to return NONE (not solicited)
TestPreimages.setQueryResult(-1);

// Configure solicit to return an error
TestPreimages.setSolicitResult(EcalliResult.HUH);

// Configure forget to return OK
TestPreimages.setForgetResult(0);

// Configure provide to return WHO error
TestPreimages.setProvideResult(EcalliResult.WHO);
```

### TestExportSegment

Override the `export_segment()` ecalli return value (refine context):

```typescript
import { TestExportSegment } from "@fluffylabs/as-lan/test";
import { EcalliResult } from "@fluffylabs/as-lan";

// Make export_segment return FULL (segment limit reached)
TestExportSegment.setResult(EcalliResult.FULL);
```

By default, `export_segment()` returns an auto-incrementing segment index (0, 1, 2, …).
Use `TestEcalli.reset()` to restore the default behavior.

### TestMachine

Configure machine ecalli stub return values (refine context, ecalli 8-13):

```typescript
import { TestMachine } from "@fluffylabs/as-lan/test";
import { EcalliResult } from "@fluffylabs/as-lan";

// Make machine() return HUH (invalid entrypoint)
TestMachine.setMachineResult(EcalliResult.HUH);

// Make peek() return OOB
TestMachine.setPeekResult(EcalliResult.OOB);

// Make poke() return OOB
TestMachine.setPokeResult(EcalliResult.OOB);

// Make invoke() return Host (3) with host call index 12 in r8
TestMachine.setInvokeResult(3, 12);

// Make expunge() return a specific hash
TestMachine.setExpungeResult(0x42);
```

By default, `machine()` returns incrementing IDs, `invoke()` returns HALT, and
all other operations return OK. Use `TestEcalli.reset()` to restore defaults.

### TestStorage

Pre-populate or delete entries in the `read()`/`write()` stub storage:

```typescript
import { BytesBlob } from "@fluffylabs/as-lan";
import { TestStorage } from "@fluffylabs/as-lan/test";

// Pre-populate a key
const key = BytesBlob.encodeAscii("counter");
```
