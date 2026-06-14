---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/service.ts#L1-L135
title: packages/jam/state/service.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 4453e1fe65eca660234a911527287eea4ee7be169e8ea977256b57933d846e4e
language: typescript
---
`packages/jam/state/service.ts` (lines 1–135)

```typescript
import {
  type CodeHash,
  type ServiceGas,
  type ServiceId,
  type TimeSlot,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
} from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec, type DescribedBy, Descriptor, type SizeHint } from "@typeberry/codec";
import { asKnownSize, type KnownSizeArray } from "@typeberry/collections";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU64, type U32, type U64 } from "@typeberry/numbers";
import { asOpaqueType, type Opaque, WithDebug } from "@typeberry/utils";

/**
 * `B_S`: The basic minimum balance which all services require.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/445800445800?v=0.6.7
 */
export const BASE_SERVICE_BALANCE = 100n;
/**
 * `B_I`: The additional minimum balance required per item of elective service state.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/445000445000?v=0.6.7
 */
export const ELECTIVE_ITEM_BALANCE = 10n;
/**
 * `B_L`: The additional minimum balance required per octet of elective service state.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/445400445400?v=0.6.7
 */
export const ELECTIVE_BYTE_BALANCE = 1n;

const zeroSizeHint: SizeHint = {
  bytes: 0,
  isExact: true,
};

/** 0-byte read, return given default value */
export const ignoreValueWithDefault = <T>(defaultValue: T) =>
  Descriptor.new<T>(
    "ignoreValue",
    zeroSizeHint,
    (_e, _v) => {},
    (_d) => defaultValue,
    (_s) => {},
  );

/** Encode and decode object with leading version number. */
export const codecWithVersion = <T, V>(val: Descriptor<T, V>): Descriptor<T, V> =>
  Descriptor.new<T>(
    "withVersion",
    {
      bytes: val.sizeHint.bytes + 8,
      isExact: false,
    },
    (e, v) => {
      e.varU64(0n);
      val.encode(e, v);
    },
    (d) => {
      const version = d.varU64();
      if (version !== 0n) {
        throw new Error("Non-zero version is not supported!");
      }
      return val.decode(d);
    },
    (s) => {
      s.varU64();
      val.skip(s);
    },
  );

/**
 * Service account details.
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/108301108301?v=0.6.7
 */
export class ServiceAccountInfo extends WithDebug {
  static Codec = codec.Class(ServiceAccountInfo, {
    codeHash: codec.bytes(HASH_SIZE).asOpaque<CodeHash>(),
    balance: codec.u64,
    accumulateMinGas: codec.u64.convert((x) => x, tryAsServiceGas),
    onTransferMinGas: codec.u64.convert((x) => x, tryAsServiceGas),
    storageUtilisationBytes: codec.u64,
    gratisStorage: codec.u64,
    storageUtilisationCount: codec.u32,
    created: codec.u32.convert((x) => x, tryAsTimeSlot),
    lastAccumulation: codec.u32.convert((x) => x, tryAsTimeSlot),
    parentService: codec.u32.convert((x) => x, tryAsServiceId),
  });

  static create(a: CodecRecord<ServiceAccountInfo>) {
    return new ServiceAccountInfo(
      a.codeHash,
      a.balance,
      a.accumulateMinGas,
      a.onTransferMinGas,
      a.storageUtilisationBytes,
      a.gratisStorage,
      a.storageUtilisationCount,
      a.created,
      a.lastAccumulation,
      a.parentService,
    );
  }

  /**
   * `a_t = max(0, BS + BI * a_i + BL * a_o - a_f)`
   * https://graypaper.fluffylabs.dev/#/7e6ff6a/119e01119e01?v=0.6.7
   */
  static calculateThresholdBalance(items: U32, bytes: U64, gratisStorage: U64): U64 {
    const storageCost =
      BASE_SERVICE_BALANCE + ELECTIVE_ITEM_BALANCE * BigInt(items) + ELECTIVE_BYTE_BALANCE * bytes - gratisStorage;

    if (storageCost < 0n) {
      return tryAsU64(0);
    }

    if (storageCost >= 2n ** 64n) {
      return tryAsU64(2n ** 64n - 1n);
    }

    return tryAsU64(storageCost);
  }

  private constructor(
    /** `a_c`: Hash of the service code. */
    public readonly codeHash: CodeHash,
    /** `a_b`: Current account balance. */
    public readonly balance: U64,
    /** `a_g`: Minimal gas required to execute Accumulate entrypoint. */
```
