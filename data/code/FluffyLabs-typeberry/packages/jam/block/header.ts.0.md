---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/header.ts#L1-L115
title: packages/jam/block/header.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 450aa8b21980b46103e33abd66dd0228b73c62acc22cfb309b19cf0911bdb521
language: typescript
---
`packages/jam/block/header.ts` (lines 1–115)

```typescript
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec, type DescribedBy } from "@typeberry/codec";
import { BANDERSNATCH_KEY_BYTES, type BandersnatchKey, ED25519_KEY_BYTES, type Ed25519Key } from "@typeberry/crypto";
import { BANDERSNATCH_VRF_SIGNATURE_BYTES, type BandersnatchVrfSignature } from "@typeberry/crypto/bandersnatch.js";
import { HASH_SIZE, WithHash } from "@typeberry/hash";
import { WithDebug } from "@typeberry/utils";
import {
  codecPerEpochBlock,
  codecPerValidator,
  type EntropyHash,
  type PerEpochBlock,
  type PerValidator,
  type StateRootHash,
  type TimeSlot,
  tryAsTimeSlot,
  tryAsValidatorIndex,
  type ValidatorIndex,
} from "./common.js";
import type { ExtrinsicHash, HeaderHash } from "./hash.js";
import { Ticket } from "./tickets.js";

/**
 * Encoded validator keys.
 * https://graypaper.fluffylabs.dev/#/68eaa1f/0e34030e3603?v=0.6.4
 */
export class ValidatorKeys extends WithDebug {
  static Codec = codec.Class(ValidatorKeys, {
    bandersnatch: codec.bytes(BANDERSNATCH_KEY_BYTES).asOpaque<BandersnatchKey>(),
    ed25519: codec.bytes(ED25519_KEY_BYTES).asOpaque<Ed25519Key>(),
  });

  static create({ bandersnatch, ed25519 }: CodecRecord<ValidatorKeys>) {
    return new ValidatorKeys(bandersnatch, ed25519);
  }

  private constructor(
    /** `kappa_b`: Bandersnatch validator keys for the NEXT epoch. */
    public readonly bandersnatch: BandersnatchKey,
    /** `kappa_e`: Ed25519 validator keys for the NEXT epoch. */
    public readonly ed25519: Ed25519Key,
  ) {
    super();
  }
}

export class TicketsMarker extends WithDebug {
  static Codec = codec.Class(TicketsMarker, {
    tickets: codecPerEpochBlock(Ticket.Codec),
  });

  static create({ tickets }: CodecRecord<TicketsMarker>) {
    return new TicketsMarker(tickets);
  }

  private constructor(public readonly tickets: PerEpochBlock<Ticket>) {
    super();
  }
}

export type TicketsMarkerView = DescribedBy<typeof TicketsMarker.Codec.View>;

/**
 * For the first block in a new epoch, the epoch marker is set
 * and contains the epoch randomness and validator keys
 * for the NEXT epoch.
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/0e30030e6603
 */
export class EpochMarker extends WithDebug {
  static Codec = codec.Class(EpochMarker, {
    entropy: codec.bytes(HASH_SIZE).asOpaque<EntropyHash>(),
    ticketsEntropy: codec.bytes(HASH_SIZE).asOpaque<EntropyHash>(),
    validators: codecPerValidator(ValidatorKeys.Codec),
  });

  static create({ entropy, ticketsEntropy, validators }: CodecRecord<EpochMarker>) {
    return new EpochMarker(entropy, ticketsEntropy, validators);
  }

  private constructor(
    /** `eta_1'`: Randomness for the NEXT epoch. */
    public readonly entropy: EntropyHash,
    /** `eta_2'`: Randomness for the CURRENT epoch. */
    public readonly ticketsEntropy: EntropyHash,
    /** `kappa_b`: Bandersnatch validator keys for the NEXT epoch. */
    public readonly validators: PerValidator<ValidatorKeys>,
  ) {
    super();
  }
}

export type EpochMarkerView = DescribedBy<typeof EpochMarker.Codec.View>;

/**
 * Return an encoded header without the seal components.
 *
 * https://graypaper.fluffylabs.dev/#/68eaa1f/370202370302?v=0.6.4
 */
export const encodeUnsealedHeader = (view: HeaderView): BytesBlob => {
  // we basically need to omit the last field, perhaps there is better
  // way to do that, but this seems like the most straightforward
  const encodedFullHeader = view.encoded().raw;
  const encodedUnsealedLen = encodedFullHeader.length - BANDERSNATCH_VRF_SIGNATURE_BYTES;
  return BytesBlob.blobFrom(encodedFullHeader.subarray(0, encodedUnsealedLen));
};

/**
 * The header of the JAM block.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/0c66000c7200?v=0.7.2
 */
export class Header extends WithDebug {
  static Codec = codec.Class(Header, {
    parentHeaderHash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    priorStateRoot: codec.bytes(HASH_SIZE).asOpaque<StateRootHash>(),
```
