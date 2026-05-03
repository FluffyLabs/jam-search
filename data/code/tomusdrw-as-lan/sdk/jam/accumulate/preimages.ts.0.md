---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/preimages.ts#L1-L115
title: sdk/jam/accumulate/preimages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 37feaa7009b00a7c298a75d27f7fddd42440ad7c507096237995ecb664cb7b8a
language: typescript
---
`sdk/jam/accumulate/preimages.ts` (lines 1–115)

```typescript
/**
 * Accumulate-context preimage management (ecalli 2, 22-24, 26).
 *
 * Composes {@link Preimages} for standard lookups and adds accumulate-only
 * operations: query, solicit, forget, provide.
 */

import { Bytes32, BytesBlob } from "../../core/bytes";
import { panic } from "../../core/panic";
import { Optional, ResultN } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { forget } from "../../ecalli/accumulate/forget";
import { provide } from "../../ecalli/accumulate/provide";
import { query } from "../../ecalli/accumulate/query";
import { solicit } from "../../ecalli/accumulate/solicit";
import { PreimageStatus, Preimages } from "../preimages";
import { CURRENT_SERVICE } from "../types";

export enum SolicitError {
  /** Invalid operation (HUH sentinel). */
  Huh = 0,
  /** Storage full (FULL sentinel). */
  Full = 1,
}

export enum ForgetError {
  /** Invalid operation (HUH sentinel). */
  Huh = 0,
}

export enum ProvideError {
  /** Unknown service (WHO sentinel). */
  Who = 0,
  /** Invalid operation (HUH sentinel). */
  Huh = 1,
}

export class AccumulatePreimages {
  static create(bufSize: u32 = 1024): AccumulatePreimages {
    return new AccumulatePreimages(bufSize);
  }

  private readonly preimages: Preimages;
  // Uint8Array: raw 8-byte buffer for load<i64> of the r8 register output from query ecalli.
  private readonly r8Buf: BytesBlob;

  private constructor(bufSize: u32) {
    this.preimages = Preimages.create(bufSize);
    this.r8Buf = BytesBlob.zero(8);
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
   * Query the status of a preimage solicitation.
   *
   * @param hash - 32-byte blake2b hash of the preimage
   * @param length - expected preimage length
   * @returns the preimage status, or none if not solicited
   */
  query(hash: Bytes32, length: u32): Optional<PreimageStatus> {
    const r7 = query(hash.ptr(), length, this.r8Buf.ptr());
    if (r7 === EcalliResult.NONE) return Optional.none<PreimageStatus>();

    const r8 = loadR8(this.r8Buf);
    return Optional.some<PreimageStatus>(decodeStatus(r7, r8));
  }

  /**
   * Request that a preimage be made available.
   *
   * @param hash - 32-byte blake2b hash of the preimage
   * @param length - expected preimage length
   * @returns ok(true) on success, or SolicitError
   */
  solicit(hash: Bytes32, length: u32): ResultN<bool, SolicitError> {
    const result = solicit(hash.ptr(), length);
    if (result === EcalliResult.HUH) return ResultN.err<bool, SolicitError>(SolicitError.Huh);
    if (result === EcalliResult.FULL) return ResultN.err<bool, SolicitError>(SolicitError.Full);
    if (result >= 0) return ResultN.ok<bool, SolicitError>(true);
    panic("AccumulatePreimages.solicit: unexpected sentinel");
    return unreachable();
  }

  /**
   * Cancel a previous preimage solicitation.
   *
   * @param hash - 32-byte blake2b hash of the preimage
   * @param length - expected preimage length
   * @returns ok(true) on success, or ForgetError
   */
  forget(hash: Bytes32, length: u32): ResultN<bool, ForgetError> {
    const result = forget(hash.ptr(), length);
    if (result === EcalliResult.HUH) return ResultN.err<bool, ForgetError>(ForgetError.Huh);
    if (result >= 0) return ResultN.ok<bool, ForgetError>(true);
    panic("AccumulatePreimages.forget: unexpected sentinel");
    return unreachable();
  }

  /**
   * Supply a preimage for a previously solicited hash.
   *
   * @param preimage - the full preimage data
   * @param serviceId - target service (default: current service)
   * @returns ok(true) on success, or ProvideError
   */
```
