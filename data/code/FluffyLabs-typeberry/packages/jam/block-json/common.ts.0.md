---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/common.ts#L1-L53
title: packages/jam/block-json/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 3dd44fea3714d79d9ed5c18fa273abf3e1f837779afb2395ad47a26165aa9561
language: typescript
---
`packages/jam/block-json/common.ts` (lines 1–53)

```typescript
import { type TicketAttempt, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import type { Ed25519Signature } from "@typeberry/crypto";
import { type FromJson, json } from "@typeberry/json-parser";

export namespace fromJson {
  export const bytesN = <N extends number, T extends Bytes<N> = Bytes<N>>(n: N) =>
    json.fromString<T>((v) => Bytes.parseBytes(v, n).asOpaque());

  export const bytesNNoPrefix = <N extends number, T extends Bytes<N> = Bytes<N>>(n: N) =>
    json.fromString<T>((v) => Bytes.parseBytesNoPrefix(v, n).asOpaque());

  export const bytes32 = <T extends Bytes<32>>() => json.fromString<T>((v) => Bytes.parseBytes(v, 32).asOpaque());

  export const bytes32NoPrefix = <T extends Bytes<32>>() =>
    json.fromString<T>((v) => Bytes.parseBytesNoPrefix(v, 32).asOpaque());

  export const bytesBlob = json.fromString(BytesBlob.parseBlob);

  export const bytesBlobNoPrefix = json.fromString(BytesBlob.parseBlobNoPrefix);

  export const ed25519Signature = json.fromString<Ed25519Signature>((v) => Bytes.parseBytes(v, 64).asOpaque());

  export const ticketAttempt = json.fromNumber((v) => {
    return tryAsTicketAttempt(v);
  }) as FromJson<TicketAttempt>;

  export const uint8Array = json.fromAny((v) => {
    if (Array.isArray(v)) {
      return new Uint8Array(v);
    }

    if (v === null) {
      return new Uint8Array();
    }

    throw new Error(`Expected an array, got ${typeof v} instead. [uint8Array]`);
  });

  export const bigUint64Array = json.fromAny((v) => {
    if (Array.isArray(v)) {
      return new BigUint64Array(v.map((x) => BigInt(x)));
    }

    if (v === null) {
      return new BigUint64Array();
    }

    throw new Error(`Expected an array, got ${typeof v} instead. [bigUint64Array]`);
  });

  export const bigUint64 = json.fromAny((v) => BigInt(v as bigint));
}
```
