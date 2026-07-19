---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/preimages.ts#L110-L150
title: sdk/jam/accumulate/preimages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 0970eaf139281a6b03debfa5e44a1eebfa743ded86bbeddc2666e1fb9ebfeb30
language: typescript
---
`sdk/jam/accumulate/preimages.ts` (lines 110–150)

```typescript
   * Supply a preimage for a previously solicited hash.
   *
   * @param preimage - the full preimage data
   * @param serviceId - target service (default: current service)
   * @returns ok(true) on success, or ProvideError
   */
  provide(preimage: BytesBlob, serviceId: u32 = CURRENT_SERVICE): ResultN<bool, ProvideError> {
    const result = provide(serviceId, preimage.ptr(), preimage.length);
    if (result === EcalliResult.WHO) return ResultN.err<bool, ProvideError>(ProvideError.Who);
    if (result === EcalliResult.HUH) return ResultN.err<bool, ProvideError>(ProvideError.Huh);
    if (result >= 0) return ResultN.ok<bool, ProvideError>(true);
    panic("AccumulatePreimages.provide: unexpected sentinel");
    return unreachable();
  }
}

/** Read the i64 value written by the query ecalli into the r8 buffer. */
function loadR8(buf: BytesBlob): i64 {
  // load<i64>: direct memory read from the buffer's backing store.
  return load<i64>(buf.raw.dataStart);
}

/**
 * Decode the query ecalli output registers into a PreimageStatus.
 *
 * Encoding (GP Appendix B, Ω_Q / ecalli 22):
 * - r7 low 32 bits  = kind (0=Requested, 1=Available, 2=Unavailable, 3=Reavailable)
 * - r7 upper 32 bits = slot0
 * - r8 low 32 bits  = slot1 (Unavailable, Reavailable)
 * - r8 upper 32 bits = slot2 (Reavailable)
 */
function decodeStatus(r7: i64, r8: i64): PreimageStatus {
  const kind = u32(r7 & 0xff);
  const slot0 = u32(r7 >> 32);
  if (kind === 0) return PreimageStatus.requested();
  if (kind === 1) return PreimageStatus.available(slot0);
  const slot1 = u32(r8 & 0xffffffff);
  if (kind === 2) return PreimageStatus.unavailable(slot0, slot1);
  const slot2 = u32(r8 >> 32);
  return PreimageStatus.reavailable(slot0, slot1, slot2);
}
```
