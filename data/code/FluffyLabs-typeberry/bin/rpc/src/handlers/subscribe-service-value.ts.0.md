---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/subscribe-service-value.ts#L1-L20
title: bin/rpc/src/handlers/subscribe-service-value.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: dd9c8d49f86191100985b756bd326a09f64cab3f1ebd8a045df3ddb2e00ba28d
language: typescript
---
`bin/rpc/src/handlers/subscribe-service-value.ts` (lines 1–20)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";
import { finalizedBlock } from "./finalized-block.js";
import { serviceValue } from "./service-value.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribeservicevalueid-key-finalized
 */
export const subscribeServiceValue: Handler<"subscribeServiceValue"> = async (params, { subscription }) => {
  return subscription.subscribe(
    "subscribeServiceValue",
    async ([serviceId, key, finalized], context) => {
      const block = finalized ? await finalizedBlock([], context) : await bestBlock([], context);

      return serviceValue([block.header_hash, serviceId, key], context);
    },
    validation.schemas.serviceValue.output,
    params,
  );
};
```
