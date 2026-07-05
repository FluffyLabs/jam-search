---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/subscribe-service-request.ts#L1-L20
title: bin/rpc/src/handlers/subscribe-service-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: da17735d6afed768a98554923f2226e0c02e812cff1a31907572f0e90985a1be
language: typescript
---
`bin/rpc/src/handlers/subscribe-service-request.ts` (lines 1–20)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";
import { finalizedBlock } from "./finalized-block.js";
import { serviceRequest } from "./service-request.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribeservicerequestid-hash-len-finalized
 */
export const subscribeServiceRequest: Handler<"subscribeServiceRequest"> = async (params, { subscription }) => {
  return subscription.subscribe(
    "subscribeServiceRequest",
    async ([serviceId, preimageHash, preimageLength, finalized], context) => {
      const block = finalized ? await finalizedBlock([], context) : await bestBlock([], context);

      return serviceRequest([block.header_hash, serviceId, preimageHash, preimageLength], context);
    },
    validation.schemas.serviceRequest.output,
    params,
  );
};
```
