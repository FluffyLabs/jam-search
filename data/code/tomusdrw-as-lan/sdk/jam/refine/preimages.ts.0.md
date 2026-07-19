---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/preimages.ts#L1-L62
title: sdk/jam/refine/preimages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9f4e640249f8dae48c28cc8ad94413d95c6832072a45dc1a09a16ae460586e87
language: typescript
---
`sdk/jam/refine/preimages.ts` (lines 1–62)

```typescript
/**
 * Refine-context preimage lookups (ecalli 2 + ecalli 6).
 *
 * Composes {@link Preimages} for standard lookups and adds
 * {@link RefinePreimages.historicalLookup} for historical state.
 */

import { Bytes32, BytesBlob } from "../../core/bytes";
import { Optional } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { historical_lookup } from "../../ecalli/refine/historical_lookup";
import { Preimages } from "../preimages";
import { CURRENT_SERVICE } from "../types";

export class RefinePreimages {
  static create(bufSize: u32 = 1024): RefinePreimages {
    return new RefinePreimages(bufSize);
  }

  private readonly preimages: Preimages;
  private buf: BytesBlob;

  private constructor(bufSize: u32) {
    this.preimages = Preimages.create(bufSize);
    this.buf = BytesBlob.zero(bufSize);
  }

  /**
   * Look up a preimage by its blake2b hash.
   *
   * @param hash - 32-byte blake2b hash of the preimage
   * @param serviceId - service to query (default: current service)
   * @returns the preimage data, or none if not found
   */
  lookup(hash: Bytes32, serviceId: u32 = CURRENT_SERVICE): Optional<BytesBlob> {
    return this.preimages.lookup(hash, serviceId);
  }

  /**
   * Look up a preimage by its blake2b hash using historical state (refine-only).
   *
   * Same semantics as {@link lookup} but queries the historical state
   * available during refinement.
   *
   * @param hash - 32-byte blake2b hash of the preimage
   * @param serviceId - service to query (default: current service)
   * @returns the preimage data, or none if not found
   */
  historicalLookup(hash: Bytes32, serviceId: u32 = CURRENT_SERVICE): Optional<BytesBlob> {
    let result = historical_lookup(serviceId, hash.ptr(), this.buf.ptr(), 0, this.buf.length);
    if (result === EcalliResult.NONE) return Optional.none<BytesBlob>();

    if (result > i64(this.buf.length)) {
      this.buf = BytesBlob.zero(u32(result));
      result = historical_lookup(serviceId, hash.ptr(), this.buf.ptr(), 0, this.buf.length);
      if (result === EcalliResult.NONE) return Optional.none<BytesBlob>();
    }

    const len = u32(min(i64(this.buf.length), result));
    return Optional.some<BytesBlob>(BytesBlob.wrap(this.buf.raw.slice(0, len)));
  }
}
```
