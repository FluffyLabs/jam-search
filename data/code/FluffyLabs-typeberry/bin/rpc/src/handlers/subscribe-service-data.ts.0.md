---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/subscribe-service-data.ts#L1-L20
title: bin/rpc/src/handlers/subscribe-service-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 8a01425fd1d529cfd647ec42459c9266f4fc9367f8b439f741da0049f3232331
language: typescript
---
`bin/rpc/src/handlers/subscribe-service-data.ts` (lines 1–20)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";
import { finalizedBlock } from "./finalized-block.js";
import { serviceData } from "./service-data.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribeservicedataid-finalized
 */
export const subscribeServiceData: Handler<"subscribeServiceData"> = async (params, { subscription }) => {
  return subscription.subscribe(
    "subscribeServiceData",
    async ([serviceId, finalized], context) => {
      const block = finalized ? await finalizedBlock([], context) : await bestBlock([], context);

      return serviceData([block.header_hash, serviceId], context);
    },
    validation.schemas.serviceData.output,
    params,
  );
};
```
