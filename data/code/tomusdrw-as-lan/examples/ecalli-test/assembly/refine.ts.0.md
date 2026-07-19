---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.ts#L1-L71
title: examples/ecalli-test/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b5d2b40e3b16bf08f3150063a9efa69d93dd416d4436a1850b1a2a448703e19d
language: typescript
---
`examples/ecalli-test/assembly/refine.ts` (lines 1–71)

```typescript
import { Decoder, RefineContext } from "@fluffylabs/as-lan";
import { logger } from "./dispatch/common";
import {
  dispatchFetch,
  dispatchGas,
  dispatchInfo,
  dispatchLog,
  dispatchLookup,
  dispatchRead,
  dispatchWrite,
} from "./dispatch/general";
import {
  dispatchExport,
  dispatchExpunge,
  dispatchHistoricalLookup,
  dispatchInvoke,
  dispatchMachine,
  dispatchPages,
  dispatchPeek,
  dispatchPoke,
} from "./dispatch/refine";
import { EcalliIndex } from "./ecalli-index";

/**
 * Refine: dynamically dispatches an ecalli host call based on the payload.
 *
 * Payload format:
 *   ecalli_index: varU64
 *   ...params (ecalli-specific, see dispatch functions)
 *
 * Response format:
 *   result: u64 LE (the ecalli return value)
 *   data: bytesVarLen (output buffer contents, if any)
 */
export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.info(
    `refine: core=${args.coreIndex} item=${args.itemIndex} service=${args.serviceId} wpHash=${args.workPackageHash}`,
  );

  const d = Decoder.fromBytesBlob(args.payload);
  const ecalliIndex = d.varU64();
  if (d.isError) {
    logger.warn("Missing ecalli index in payload");
    return 0;
  }

  logger.info(`dispatch ecalli ${ecalliIndex}`);

  // General (0-5, 100)
  if (ecalliIndex === EcalliIndex.Gas) return dispatchGas();
  if (ecalliIndex === EcalliIndex.Fetch) return dispatchFetch(d);
  if (ecalliIndex === EcalliIndex.Lookup) return dispatchLookup(d);
  if (ecalliIndex === EcalliIndex.Read) return dispatchRead(d);
  if (ecalliIndex === EcalliIndex.Write) return dispatchWrite(d);
  if (ecalliIndex === EcalliIndex.Info) return dispatchInfo(d);
  if (ecalliIndex === EcalliIndex.Log) return dispatchLog(d);
  // Refine (6-13)
  if (ecalliIndex === EcalliIndex.HistoricalLookup) return dispatchHistoricalLookup(d);
  if (ecalliIndex === EcalliIndex.Export) return dispatchExport(d);
  if (ecalliIndex === EcalliIndex.Machine) return dispatchMachine(d);
  if (ecalliIndex === EcalliIndex.Peek) return dispatchPeek(d);
  if (ecalliIndex === EcalliIndex.Poke) return dispatchPoke(d);
  if (ecalliIndex === EcalliIndex.Pages) return dispatchPages(d);
  if (ecalliIndex === EcalliIndex.Invoke) return dispatchInvoke(d);
  if (ecalliIndex === EcalliIndex.Expunge) return dispatchExpunge(d);

  logger.warn(`Unknown ecalli index: ${ecalliIndex}`);
  return 0;
}
```
