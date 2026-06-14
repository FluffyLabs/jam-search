---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/service-preimage.ts#L1-L30
title: bin/rpc/src/handlers/service-preimage.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 847460b4d3464808bc13aa89c44a0b267e4253d240252ed58d78f86030bc5336
language: typescript
---
`bin/rpc/src/handlers/service-preimage.ts` (lines 1–30)

```typescript
import { type HeaderHash, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#servicepreimageheader_hash-id-hash
 */
export const servicePreimage: Handler<"servicePreimage"> = async ([headerHash, serviceId, preimageHash], { db }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const state = db.states.getState(hashOpaque);

  if (state === null) {
    throw new RpcError(RpcErrorCode.Other, `State not found for block: ${hashOpaque.toString()}`);
  }

  const service = state.getService(tryAsServiceId(serviceId));

  if (service === null) {
    throw new RpcError(RpcErrorCode.Other, `Service not found: ${serviceId.toString()}`);
  }

  const preimage = service.getPreimage(Bytes.fromBlob(preimageHash, HASH_SIZE).asOpaque());

  if (preimage === null) {
    return null;
  }

  return preimage.raw;
};
```
