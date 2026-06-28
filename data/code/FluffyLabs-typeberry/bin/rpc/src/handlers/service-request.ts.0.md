---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/service-request.ts#L1-L31
title: bin/rpc/src/handlers/service-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 6da7ba1edd3ee8da4922d278d10d25e9b8f26773a207647e30a7bac42f1ec657
language: typescript
---
`bin/rpc/src/handlers/service-request.ts` (lines 1–31)

```typescript
import { type HeaderHash, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import type { Handler } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#servicerequestheader_hash-id-hash-len
 */
export const serviceRequest: Handler<"serviceRequest"> = async (
  [headerHash, serviceId, preimageHash, preimageLength],
  { db },
) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const state = db.states.getState(hashOpaque);
  if (state === null) {
    return null;
  }

  const service = state.getService(tryAsServiceId(serviceId));
  if (service === null) {
    return null;
  }

  const slots = service.getLookupHistory(Bytes.fromBlob(preimageHash, HASH_SIZE).asOpaque(), tryAsU32(preimageLength));
  if (slots === null) {
    return null;
  }

  return slots;
};
```
