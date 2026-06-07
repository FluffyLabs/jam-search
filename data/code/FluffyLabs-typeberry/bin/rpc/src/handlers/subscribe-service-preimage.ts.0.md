---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/subscribe-service-preimage.ts#L1-L20
title: bin/rpc/src/handlers/subscribe-service-preimage.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d55dd3abe33f22aee2743ba681a3652003c959dbf94faeac640ff1fb70708e8c
language: typescript
---
`bin/rpc/src/handlers/subscribe-service-preimage.ts` (lines 1–20)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";
import { finalizedBlock } from "./finalized-block.js";
import { servicePreimage } from "./service-preimage.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribeservicepreimageid-hash-finalized
 */
export const subscribeServicePreimage: Handler<"subscribeServicePreimage"> = async (params, { subscription }) => {
  return subscription.subscribe(
    "subscribeServicePreimage",
    async ([serviceId, preimageHash, finalized], context) => {
      const block = finalized ? await finalizedBlock([], context) : await bestBlock([], context);

      return servicePreimage([block.header_hash, serviceId, preimageHash], context);
    },
    validation.schemas.servicePreimage.output,
    params,
  );
};
```
