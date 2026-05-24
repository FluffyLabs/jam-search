---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/service-value.ts#L1-L30
title: bin/rpc/src/handlers/service-value.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d38f1626208868bc1b8db240d2ae525f8b1bc246295816a0ed3110e651b6d0de
language: typescript
---
`bin/rpc/src/handlers/service-value.ts` (lines 1–30)

```typescript
import { type HeaderHash, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#servicevalueheader_hash-id-key
 */
export const serviceValue: Handler<"serviceValue"> = async ([headerHash, serviceId, key], { db }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const state = db.states.getState(hashOpaque);

  if (state === null) {
    throw new RpcError(RpcErrorCode.Other, `State not found for block: ${hashOpaque.toString()}`);
  }

  const service = state.getService(tryAsServiceId(serviceId));

  if (service === null) {
    return null;
  }

  const storageValue = service.getStorage(Bytes.fromBlob(key, key.length).asOpaque());

  if (storageValue === null) {
    return null;
  }

  return storageValue.raw;
};
```
