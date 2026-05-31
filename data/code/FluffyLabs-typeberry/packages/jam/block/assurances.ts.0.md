---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/assurances.ts#L1-L75
title: packages/jam/block/assurances.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0b9512d6b1c130bd1bf94ef553851bea833234e0b1694b5106438d0271a8698d
language: typescript
---
`packages/jam/block/assurances.ts` (lines 1–75)

```typescript
import type { BitVec } from "@typeberry/bytes";
import { type CodecRecord, codec, type DescribedBy } from "@typeberry/codec";
import type { KnownSizeArray } from "@typeberry/collections";
import { ED25519_SIGNATURE_BYTES, type Ed25519Signature } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { WithDebug } from "@typeberry/utils";
import { codecKnownSizeArray, codecWithContext } from "./codec-utils.js";
import type { ValidatorIndex } from "./common.js";
import type { HeaderHash } from "./hash.js";

/**
 *
 * A work-report is said to become available iff there are a clear
 * 2/3 supermajority of validators who have marked its core as set within
 * the block's assurance extrinsic.
 * https://graypaper.fluffylabs.dev/#/579bd12/145800145c00
 */
export class AvailabilityAssurance extends WithDebug {
  static Codec = codec.Class(AvailabilityAssurance, {
    anchor: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    bitfield: codecWithContext((context) => {
      return codec.bitVecFixLen(context.coresCount);
    }),
    validatorIndex: codec.u16.asOpaque<ValidatorIndex>(),
    signature: codec.bytes(ED25519_SIGNATURE_BYTES).asOpaque<Ed25519Signature>(),
  });

  static create({ anchor, bitfield, validatorIndex, signature }: CodecRecord<AvailabilityAssurance>) {
    return new AvailabilityAssurance(anchor, bitfield, validatorIndex, signature);
  }

  private constructor(
    /**
     * The assurances must all be anchored on the parent.
     * https://graypaper.fluffylabs.dev/#/579bd12/145800145c00
     */
    public readonly anchor: HeaderHash,
    /**
     * A series of binary values, one per core.
     *
     * Value of `1` implies that  the validator assures they are contributing
     * to that's core validity.
     */
    public readonly bitfield: BitVec,
    /** Validator index that signed this assurance. */
    public readonly validatorIndex: ValidatorIndex,
    /** Signature over the anchor and the bitfield. */
    public readonly signature: Ed25519Signature,
  ) {
    super();
  }
}

const AssurancesExtrinsicBounds = "[0 .. ValidatorsCount)";
/**
 * `E_A`: Sequence with at most one item per validator.
 *
 * Assurances must be ordered by validator index.
 * https://graypaper.fluffylabs.dev/#/579bd12/145800145c00
 */
export type AssurancesExtrinsic = KnownSizeArray<AvailabilityAssurance, typeof AssurancesExtrinsicBounds>;

export const assurancesExtrinsicCodec = codecWithContext((context) => {
  return codecKnownSizeArray(
    AvailabilityAssurance.Codec,
    {
      minLength: 0,
      maxLength: context.validatorsCount,
      typicalLength: context.validatorsCount / 2,
    },
    AssurancesExtrinsicBounds,
  );
});

export type AssurancesExtrinsicView = DescribedBy<typeof assurancesExtrinsicCodec.View>;
```
