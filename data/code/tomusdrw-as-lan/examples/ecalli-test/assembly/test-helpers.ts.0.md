---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/test-helpers.ts#L1-L33
title: examples/ecalli-test/assembly/test-helpers.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f7392fe4f3dbdb4739f96091c00ed7edcbb5f660d73d47adc9657eb3ee47400c
language: typescript
---
`examples/ecalli-test/assembly/test-helpers.ts` (lines 1–33)

```typescript
import { AccumulateContext, BytesBlob, Decoder, Response } from "@fluffylabs/as-lan";
import { AccumulateCall, OperandItem, RefineCall, TestAccumulate, TransferItem } from "@fluffylabs/as-lan/test";
import { accumulate } from "./accumulate";
import { refine } from "./refine";

// Re-export SDK helpers used by test files.
export { Response } from "@fluffylabs/as-lan";
export { strBlob } from "@fluffylabs/as-lan/test";

/** Call refine with the given ecalli dispatch payload, returning the decoded Response. */
export function callRefine(payload: BytesBlob): Response {
  return RefineCall.create().call(refine, payload);
}

/** Call accumulate with the given number of pre-seeded items, returning the raw response bytes. */
export function callAccumulate(argsLength: u32): BytesBlob {
  return AccumulateCall.create().call(accumulate, argsLength);
}

/** Build an encoded `AccumulateItem::PendingTransfer` blob with the given fields and an empty memo. */
export function buildTransferItem(source: u32, dest: u32, amount: u64, gas: u64): BytesBlob {
  return TransferItem.create().withSource(source).withDest(dest).withAmount(amount).withGas(gas).build();
}

/**
 * Set up an operand whose okBlob dispatches the given ecalli, then call accumulate.
 * Returns the decoded Response from the dispatch.
 */
export function callAccumulateWithOperand(ecalliPayload: BytesBlob): Response {
  TestAccumulate.setItem(0, OperandItem.create().withOkBlob(ecalliPayload).build());
  const raw = callAccumulate(1);
  return AccumulateContext.create().response.decode(Decoder.fromBytesBlob(raw)).okay!;
}
```
