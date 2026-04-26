---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/preimages.ts#L1-L98'
title: sdk/jam/preimages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: ea3f830ed01f322eae9fbf39b4d5e8ecc7261c3e12814443dbb3195794ac0101
language: typescript
---
`sdk/jam/preimages.ts` (lines 1–98)

```typescript
/**
 * High-level wrapper for preimage lookups (ecalli 2).
 *
 * - {@link Preimages} — lookup preimages by hash for any service.
 * - {@link PreimageStatus} — status returned by the accumulate-context `query` ecalli.
 */

import { Bytes32, BytesBlob } from "../core/bytes";
import { Optional } from "../core/result";
import { EcalliResult } from "../ecalli";
import { lookup } from "../ecalli/general/lookup";
import { CURRENT_SERVICE, Slot } from "./types";

/** Discriminant for {@link PreimageStatus}. */
export enum PreimageStatusKind {
  /** Preimage solicited but not yet available (0 slots). */
  Requested = 0,
  /** Preimage is currently available (1 slot). */
  Available = 1,
  /** Preimage was available then became unavailable (2 slots). */
  Unavailable = 2,
  /** Preimage became available again after being unavailable (3 slots). */
  Reavailable = 3,
}

/**
 * Status of a preimage as returned by the `query` ecalli (22).
 *
 * The number of valid slot fields depends on `kind`:
 * - Requested: no slots
 * - Available: slot0
 * - Unavailable: slot0, slot1
 * - Reavailable: slot0, slot1, slot2
 */
export class PreimageStatus {
  static requested(): PreimageStatus {
    return new PreimageStatus(PreimageStatusKind.Requested, 0, 0, 0);
  }

  static available(slot0: Slot): PreimageStatus {
    return new PreimageStatus(PreimageStatusKind.Available, slot0, 0, 0);
  }

  static unavailable(slot0: Slot, slot1: Slot): PreimageStatus {
    return new PreimageStatus(PreimageStatusKind.Unavailable, slot0, slot1, 0);
  }

  static reavailable(slot0: Slot, slot1: Slot, slot2: Slot): PreimageStatus {
    return new PreimageStatus(PreimageStatusKind.Reavailable, slot0, slot1, slot2);
  }

  private constructor(
    public readonly kind: PreimageStatusKind,
    public readonly slot0: Slot,
    public readonly slot1: Slot,
    public readonly slot2: Slot,
  ) {}
}

/**
 * High-level preimage lookup wrapping ecalli 2.
 *
 * Manages an internal buffer with auto-expansion (same pattern as
 * {@link ServiceData.read}). Available in all invocation contexts.
 */
export class Preimages {
  static create(bufSize: u32 = 1024): Preimages {
    return new Preimages(bufSize);
  }

  private buf: BytesBlob;

  private constructor(bufSize: u32) {
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
    let result = lookup(serviceId, hash.ptr(), this.buf.ptr(), 0, this.buf.length);
    if (result === EcalliResult.NONE) return Optional.none<BytesBlob>();

    // Auto-expand: the host told us the total length exceeds our buffer.
    if (result > i64(this.buf.length)) {
      this.buf = BytesBlob.zero(u32(result));
      result = lookup(serviceId, hash.ptr(), this.buf.ptr(), 0, this.buf.length);
      if (result === EcalliResult.NONE) return Optional.none<BytesBlob>();
    }

    const len = u32(min(i64(this.buf.length), result));
    return Optional.some<BytesBlob>(BytesBlob.wrap(this.buf.raw.slice(0, len)));
  }
}
```
