---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/validator-data.ts#L1-L55
title: packages/jam/state/validator-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f3f94322877192bd7e80d3d6b1e520a4804de7565a4080e77dcb5e895b2fed0a
language: typescript
---
`packages/jam/state/validator-data.ts` (lines 1–55)

```typescript
import { codecPerValidator } from "@typeberry/block";
import type { Bytes } from "@typeberry/bytes";
import { type CodecRecord, codec, type DescribedBy } from "@typeberry/codec";
import {
  BANDERSNATCH_KEY_BYTES,
  type BandersnatchKey,
  BLS_KEY_BYTES,
  type BlsKey,
  ED25519_KEY_BYTES,
  type Ed25519Key,
} from "@typeberry/crypto";
import { WithDebug } from "@typeberry/utils";

/**
 * Fixed size of validator metadata.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/0d55010d5501
 */
export const VALIDATOR_META_BYTES = 128;
export type VALIDATOR_META_BYTES = typeof VALIDATOR_META_BYTES;

/**
 * Details about validators' identity.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/0d4b010d4c01
 */
export class ValidatorData extends WithDebug {
  static Codec = codec.Class(ValidatorData, {
    bandersnatch: codec.bytes(BANDERSNATCH_KEY_BYTES).asOpaque<BandersnatchKey>(),
    ed25519: codec.bytes(ED25519_KEY_BYTES).asOpaque<Ed25519Key>(),
    bls: codec.bytes(BLS_KEY_BYTES).asOpaque<BlsKey>(),
    metadata: codec.bytes(VALIDATOR_META_BYTES),
  });

  static create({ ed25519, bandersnatch, bls, metadata }: CodecRecord<ValidatorData>) {
    return new ValidatorData(bandersnatch, ed25519, bls, metadata);
  }

  private constructor(
    /** Bandersnatch public key. */
    public readonly bandersnatch: BandersnatchKey,
    /** ED25519 key data. */
    public readonly ed25519: Ed25519Key,
    /** BLS public key. */
    public readonly bls: BlsKey,
    /** Validator-defined additional metdata. */
    public readonly metadata: Bytes<VALIDATOR_META_BYTES>,
  ) {
    super();
  }
}

export type ValidatorDataView = DescribedBy<typeof ValidatorData.Codec.View>;

export const validatorsDataCodec = codecPerValidator(ValidatorData.Codec);
```
