---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/authorize.ts#L1-L53
title: examples/ecalli-test/assembly/authorize.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4eb82a586b747ccc9d843d30e635c8b896423cf93640afc8e04d51f6d1398701
language: typescript
---
`examples/ecalli-test/assembly/authorize.ts` (lines 1–53)

```typescript
import { AuthorizeContext, AuthorizeFetcher, Decoder } from "@fluffylabs/as-lan";
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
import { EcalliIndex } from "./ecalli-index";

/**
 * Authorize: dispatches an ecalli host call based on the authConfig payload.
 *
 * The authConfig blob (fetch kind=8) is used as the dispatch payload,
 * following the same format as refine's work-item payload:
 *   ecalli_index: varU64
 *   ...params (ecalli-specific, see dispatch functions)
 *
 * This is a test dispatcher — it does not perform real authorization.
 * The dispatch result is returned as the authorization trace.
 */
export function is_authorized(ptr: u32, len: u32): u64 {
  const ctx = AuthorizeContext.create();
  const coreIndex = ctx.parseCoreIndex(ptr, len);
  const fetcher = AuthorizeFetcher.create();
  logger.info(`authorize: core=${coreIndex}`);

  // Use authConfig as the dispatch payload
  const authConfig = fetcher.authConfig();
  const d = Decoder.fromBytesBlob(authConfig);
  const ecalliIndex = d.varU64();
  if (d.isError) {
    logger.warn("Missing ecalli index in authConfig");
    return 0;
  }

  logger.info(`authorize dispatch ecalli ${ecalliIndex}`);

  // General (0-5, 100)
  if (ecalliIndex === EcalliIndex.Gas) return dispatchGas();
  if (ecalliIndex === EcalliIndex.Fetch) return dispatchFetch(d);
  if (ecalliIndex === EcalliIndex.Lookup) return dispatchLookup(d);
  if (ecalliIndex === EcalliIndex.Read) return dispatchRead(d);
  if (ecalliIndex === EcalliIndex.Write) return dispatchWrite(d);
  if (ecalliIndex === EcalliIndex.Info) return dispatchInfo(d);
  if (ecalliIndex === EcalliIndex.Log) return dispatchLog(d);

  logger.warn(`Unknown ecalli index for authorize: ${ecalliIndex}`);
  return 0;
}
```
