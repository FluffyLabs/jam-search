---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/chain-spec.ts#L1-L106
title: packages/jam/config/chain-spec.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: 3dc0337a706f22336289321e286af4f18388d9af3dfc54444c3c136e6f950ff4
language: typescript
---
`packages/jam/config/chain-spec.ts` (lines 1–106)

```typescript
import { tryAsU8, tryAsU16, tryAsU32, tryAsU64, type U8, type U16, type U32, type U64 } from "@typeberry/numbers";
import { WithDebug } from "@typeberry/utils";

/**
 * Estimated number of validators.
 *
 * NOTE: Should ONLY be used to pre-allocate some data.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/418800418800
 */
export const EST_VALIDATORS = 1023;
/**
 * Estimated number of super majority of validators.
 *
 * NOTE: Should ONLY be used to pre-allocate some data.
 */
export const EST_VALIDATORS_SUPER_MAJORITY = 683;
/**
 * Estimated number of cores.
 *
 * NOTE: Should ONLY be used to pre-allocate some data.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/414200414200
 */
export const EST_CORES = 341;
/**
 * Estimated epoch length (in time slots).
 *
 * NOTE: Should ONLY be used to pre-allocate some data.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/414800414800
 */
export const EST_EPOCH_LENGTH = 600;

/** `W_G`: W_P * W_E = 4104 The size of a segment in octets. */
export const EC_SEGMENT_SIZE = 4104;

/**
 * Additional data that has to be passed to the codec to correctly parse incoming bytes.
 */
export class ChainSpec extends WithDebug {
  /** Human-readable name of the chain spec. */
  readonly name: string;
  /** Number of validators. */
  readonly validatorsCount: U16;
  /** 1/3 of number of validators */
  readonly thirdOfValidators: U16;
  /** 2/3 of number of validators + 1 */
  readonly validatorsSuperMajority: U16;
  /** Number of cores. */
  readonly coresCount: U16;
  /**
   * `D`: Period in timeslots after which an unreferenced preimage may be expunged.
   *
   * https://graypaper.fluffylabs.dev/#/9a08063/445800445800?v=0.6.6
   */
  readonly preimageExpungePeriod: U32;
  /** Duration of a timeslot in seconds. */
  readonly slotDuration: U16;
  /** Length of the epoch in time slots. */
  readonly epochLength: U32;
  /** Length of the ticket contest in time slots. */
  readonly contestLength: U32;
  /** The maximum number of tickets each validator can submit. */
  readonly ticketsPerValidator: U8;
  /** The maximum number of tickets that can be included in a single block. */
  readonly maxTicketsPerExtrinsic: U8;
  /**
   * `R`: The rotation period of validator-core assignments, in timeslots.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/417f00417f00
   */
  readonly rotationPeriod: U16;
  /** `W_P`: The number of erasure-coded pieces in a segment. */
  readonly numberECPiecesPerSegment: U32;
  /** `W_E`: The basic size of erasure-coded pieces in octets. Computed from `W_E = W_G / W_P`. */
  readonly erasureCodedPieceSize: U32;
  /** `G_T`: The total gas allocated across all Accumulation. */
  readonly maxBlockGas: U64;
  /** `G_R`: The gas allocated to invoke a work-package’s Refine logic. */
  readonly maxRefineGas: U64;
  /** `L`: The maximum age in timeslots of the lookup anchor. */
  readonly maxLookupAnchorAge: U32;

  static new(data: Omit<ChainSpec, "validatorsSuperMajority" | "thirdOfValidators" | "erasureCodedPieceSize">) {
    return new ChainSpec(data);
  }

  private constructor(
    data: Omit<ChainSpec, "validatorsSuperMajority" | "thirdOfValidators" | "erasureCodedPieceSize">,
  ) {
    super();

    this.name = data.name;
    this.validatorsCount = data.validatorsCount;
    this.thirdOfValidators = tryAsU16(Math.floor(data.validatorsCount / 3));
    this.validatorsSuperMajority = tryAsU16(Math.floor(data.validatorsCount / 3) * 2 + 1);
    this.coresCount = data.coresCount;
    this.slotDuration = data.slotDuration;
    this.epochLength = data.epochLength;
    this.rotationPeriod = data.rotationPeriod;
    this.contestLength = data.contestLength;
    this.ticketsPerValidator = data.ticketsPerValidator;
    this.maxTicketsPerExtrinsic = data.maxTicketsPerExtrinsic;
    this.numberECPiecesPerSegment = data.numberECPiecesPerSegment;
    this.preimageExpungePeriod = data.preimageExpungePeriod;
```
