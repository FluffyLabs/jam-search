---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/accumulate.ts#L126-L168
title: examples/ecalli-test/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 3483d9296f8000b74c3b0050490709f536f0d1a860310ef3f275c48c98324445
language: typescript
---
`examples/ecalli-test/assembly/accumulate.ts` (lines 126–168)

```typescript
  if (ecalliIndex === EcalliIndex.Lookup) return dispatchLookup(pd);
  if (ecalliIndex === EcalliIndex.Read) return dispatchRead(pd);
  if (ecalliIndex === EcalliIndex.Write) return dispatchWrite(pd);
  if (ecalliIndex === EcalliIndex.Info) return dispatchInfo(pd);
  if (ecalliIndex === EcalliIndex.Log) return dispatchLog(pd);
  // Accumulate (14-26)
  if (ecalliIndex === EcalliIndex.Bless) return dispatchBless(pd);
  if (ecalliIndex === EcalliIndex.Assign) return dispatchAssign(pd);
  if (ecalliIndex === EcalliIndex.Designate) return dispatchDesignate(pd);
  if (ecalliIndex === EcalliIndex.Checkpoint) return dispatchCheckpoint();
  if (ecalliIndex === EcalliIndex.NewService) return dispatchNewService(pd);
  if (ecalliIndex === EcalliIndex.Upgrade) return dispatchUpgrade(pd);
  if (ecalliIndex === EcalliIndex.Transfer) return dispatchTransfer(pd);
  if (ecalliIndex === EcalliIndex.Eject) return dispatchEject(pd);
  if (ecalliIndex === EcalliIndex.Query) return dispatchQuery(pd);
  if (ecalliIndex === EcalliIndex.Solicit) return dispatchSolicit(pd);
  if (ecalliIndex === EcalliIndex.Forget) return dispatchForget(pd);
  if (ecalliIndex === EcalliIndex.YieldResult) return dispatchYieldResult(pd);
  if (ecalliIndex === EcalliIndex.Provide) return dispatchProvide(pd);

  logger.warn(`operand[${index}]: unknown ecalli ${ecalliIndex}`);
  return 0;
}

/** Process a transfer: decode and log it. */
function processTransfer(ctx: AccumulateContext, d: Decoder, index: u32): u64 {
  const tr = ctx.pendingTransfer.decode(d);
  if (tr.isError) {
    logger.warn(`Failed to decode transfer at index ${index}`);
    return 0;
  }
  const tx = tr.okay!;

  logger.info(`transfer[${index}]: source=${tx.source} dest=${tx.destination} amount=${tx.amount} gas=${tx.gas}`);

  // Encode transfer details as Response data for test verification
  const data = Encoder.create();
  data.u32(tx.source);
  data.u32(tx.destination);
  data.u64(tx.amount);
  data.u64(tx.gas);
  return Response.with(0, data.finish());
}
```
