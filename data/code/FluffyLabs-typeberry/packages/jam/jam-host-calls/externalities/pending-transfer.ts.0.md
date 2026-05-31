---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/pending-transfer.ts#L1-L37
title: packages/jam/jam-host-calls/externalities/pending-transfer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 60e9091b92643bc3d928791ba3ba795b7d7b91f1f8a80a8d87cc58124d5faa34
language: typescript
---
`packages/jam/jam-host-calls/externalities/pending-transfer.ts` (lines 1–37)

```typescript
import type { ServiceGas, ServiceId } from "@typeberry/block";
import type { Bytes } from "@typeberry/bytes";
import { type CodecRecord, codec } from "@typeberry/codec";
import type { U64 } from "@typeberry/numbers";
import { TRANSFER_MEMO_BYTES } from "./partial-state.js";

/**
 * Deferred Transfer.
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/173900173900?v=0.6.6
 */
export class PendingTransfer {
  static Codec = codec.Class(PendingTransfer, {
    source: codec.u32.asOpaque<ServiceId>(),
    destination: codec.u32.asOpaque<ServiceId>(),
    amount: codec.u64,
    memo: codec.bytes(TRANSFER_MEMO_BYTES),
    gas: codec.u64.asOpaque<ServiceGas>(),
  });

  private constructor(
    /** `s`: sending service */
    public readonly source: ServiceId,
    /** `d`: receiving service */
    public readonly destination: ServiceId,
    /** `a`: transfer amount */
    public readonly amount: U64,
    /** `m`: arbitrary bytes sent alongside the transfer (memo) */
    public readonly memo: Bytes<TRANSFER_MEMO_BYTES>,
    /** `g`: gas allowance for the transfer */
    public readonly gas: ServiceGas,
  ) {}

  static create({ source, destination, amount, memo, gas }: CodecRecord<PendingTransfer>) {
    return new PendingTransfer(source, destination, amount, memo, gas);
  }
}
```
