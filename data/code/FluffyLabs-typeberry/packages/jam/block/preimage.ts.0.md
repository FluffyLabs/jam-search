---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/preimage.ts#L1-L41
title: packages/jam/block/preimage.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3ddda1f9fb0aa3429d42cb5a7a4a9c6c64ed1f57e54af336dec43945518b37e1
language: typescript
---
`packages/jam/block/preimage.ts` (lines 1–41)

```typescript
import type { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec } from "@typeberry/codec";
import type { Blake2bHash } from "@typeberry/hash";
import { type Opaque, WithDebug } from "@typeberry/utils";
import type { ServiceId } from "./common.js";

export type PreimageHash = Opaque<Blake2bHash, "PreimageHash">;

/**
 * Service index (requester) and the data (blob).
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/181500181600
 */
export class Preimage extends WithDebug {
  static Codec = codec.Class(Preimage, {
    requester: codec.u32.asOpaque<ServiceId>(),
    blob: codec.blob,
  });
  static create({ requester, blob }: CodecRecord<Preimage>) {
    return new Preimage(requester, blob);
  }

  private constructor(
    /** The service which requested the preimage. */
    public readonly requester: ServiceId,
    /** The preimage data blob. */
    public readonly blob: BytesBlob,
  ) {
    super();
  }
}

/**
 * The lookup extrinsic is a sequence of pairs of service indices and data.
 *
 * These pairs must be ordered and without duplicates. The data must have been
 * solicited by a service but not yet be provided.
 */
export type PreimagesExtrinsic = Preimage[];

export const preimagesExtrinsicCodec = codec.sequenceVarLen(Preimage.Codec);
```
