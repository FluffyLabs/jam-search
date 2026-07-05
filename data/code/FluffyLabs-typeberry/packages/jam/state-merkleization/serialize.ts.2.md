---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialize.ts#L198-L221
title: packages/jam/state-merkleization/serialize.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: b6ffd86d3c81c66527b9e4aca426cc121dc1e1b8c59e66f3acd9c74e1104e9e3
language: typescript
---
`packages/jam/state-merkleization/serialize.ts` (lines 198–221)

```typescript
    Codec: dumpCodec,
  });

  /** https://graypaper.fluffylabs.dev/#/ab2cdbd/3bea033b0904?v=0.7.2 */
  export const serviceLookupHistory = (blake2b: Blake2b, serviceId: ServiceId, hash: PreimageHash, len: U32) => ({
    key: stateKeys.serviceLookupHistory(blake2b, serviceId, hash, len),
    Codec: codec.readonlyArray(codec.sequenceVarLen(codec.u32)),
  });
}

/**
 * Just dump the entire terminal blob as-is.
 *
 * NOTE this is most likely NOT what you need! `dump` cannot
 * determine the boundary of the bytes, so it can only be used
 * as the last element of the codec and can't be used in sequences!
 */
export const dumpCodec = Descriptor.new<BytesBlob>(
  "Dump",
  { bytes: 64, isExact: false },
  (e, v) => e.bytes(Bytes.fromBlob(v.raw, v.raw.length)),
  (d) => BytesBlob.blobFrom(d.bytes(d.source.length - d.bytesRead()).raw),
  (s) => s.bytes(s.decoder.source.length - s.decoder.bytesRead()),
);
```
