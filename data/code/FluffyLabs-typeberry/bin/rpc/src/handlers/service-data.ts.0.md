---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/service-data.ts#L1-L26
title: bin/rpc/src/handlers/service-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 3502fe8da0194f7d7790d9c1832baf2fa59228760022f64afd9cc7430a76a347
language: typescript
---
`bin/rpc/src/handlers/service-data.ts` (lines 1–26)

```typescript
import { type HeaderHash, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode } from "@typeberry/rpc-validation";
import { ServiceAccountInfo } from "@typeberry/state";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#servicedataheader_hash-id
 */
export const serviceData: Handler<"serviceData"> = async ([headerHash, serviceId], { db, chainSpec }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const state = db.states.getState(hashOpaque);

  if (state === null) {
    throw new RpcError(RpcErrorCode.Other, `State not found for block: ${hashOpaque.toString()}`);
  }

  const serviceData = state.getService(tryAsServiceId(serviceId));

  if (serviceData === null) {
    return null;
  }

  return Encoder.encodeObject(ServiceAccountInfo.Codec, serviceData.getInfo(), chainSpec).raw;
};
```
