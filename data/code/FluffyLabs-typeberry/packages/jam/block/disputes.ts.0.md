---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/disputes.ts#L1-L108
title: packages/jam/block/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 2ef84c97a595347b907b98471dcc06f9cabd7e7ff27c5a6d0d179a32d10241a9
language: typescript
---
`packages/jam/block/disputes.ts` (lines 1–108)

```typescript
import { type CodecRecord, codec } from "@typeberry/codec";
import { asKnownSize, type KnownSizeArray } from "@typeberry/collections";
import { ED25519_KEY_BYTES, ED25519_SIGNATURE_BYTES, type Ed25519Key, type Ed25519Signature } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { seeThrough, WithDebug } from "@typeberry/utils";
import { codecWithContext } from "./codec-utils.js";
import type { Epoch, ValidatorIndex } from "./common.js";
import type { WorkReportHash } from "./hash.js";

/**
 * Proof of signing a contradictory [`Judgement`] of a work report.
 */
export class Fault extends WithDebug {
  static Codec = codec.Class(Fault, {
    workReportHash: codec.bytes(HASH_SIZE).asOpaque<WorkReportHash>(),
    wasConsideredValid: codec.bool,
    key: codec.bytes(ED25519_KEY_BYTES).asOpaque<Ed25519Key>(),
    signature: codec.bytes(ED25519_SIGNATURE_BYTES).asOpaque<Ed25519Signature>(),
  });

  static create({ workReportHash, wasConsideredValid, key, signature }: CodecRecord<Fault>) {
    return new Fault(workReportHash, wasConsideredValid, key, signature);
  }

  private constructor(
    /** Hash of the work-report that had conflicting votes. */
    public readonly workReportHash: WorkReportHash,
    /** Did the validator consider this work-report valid in their [`Judgement`]? */
    public readonly wasConsideredValid: boolean,
    /** Validator key that provided the signature. */
    public readonly key: Ed25519Key,
    /** Original signature that was part of the [`Judgement`]. */
    public readonly signature: Ed25519Signature,
  ) {
    super();
  }
}

/**
 * Proof of guaranteeing a work-report found to be invalid.
 */
export class Culprit extends WithDebug {
  static Codec = codec.Class(Culprit, {
    workReportHash: codec.bytes(HASH_SIZE).asOpaque<WorkReportHash>(),
    key: codec.bytes(ED25519_KEY_BYTES).asOpaque<Ed25519Key>(),
    signature: codec.bytes(ED25519_SIGNATURE_BYTES).asOpaque<Ed25519Signature>(),
  });

  static create({ workReportHash, key, signature }: CodecRecord<Culprit>) {
    return new Culprit(workReportHash, key, signature);
  }

  private constructor(
    /** Hash of the invalid work-report. */
    public readonly workReportHash: WorkReportHash,
    /** Validator key that provided the signature. */
    public readonly key: Ed25519Key,
    /** Original signature that was part of the [`Judgement`]. */
    public readonly signature: Ed25519Signature,
  ) {
    super();
  }
}

/**
 * A vote for validity or invalidity of a [`WorkReport`] signed by a particular validator.
 */
export class Judgement extends WithDebug {
  static Codec = codec.Class(Judgement, {
    isWorkReportValid: codec.bool,
    index: codec.u16.asOpaque<ValidatorIndex>(),
    signature: codec.bytes(ED25519_SIGNATURE_BYTES).asOpaque<Ed25519Signature>(),
  });

  static create({ isWorkReportValid, index, signature }: CodecRecord<Judgement>) {
    return new Judgement(isWorkReportValid, index, signature);
  }

  private constructor(
    /** Whether the work report is considered valid or not. */
    public readonly isWorkReportValid: boolean,
    /** Index of the validator that signed this vote. */
    public readonly index: ValidatorIndex,
    /** The signature. */
    public readonly signature: Ed25519Signature,
  ) {
    super();
  }
}

/**
 * Votes by super majority of the validator set
 * (either using keys from current epoch or previous)
 * over validity or invalidity of a particular [`WorkReport`].
 *
 * https://graypaper.fluffylabs.dev/#/1c979cb/121c01122f01?v=0.7.1
 */
export class Verdict extends WithDebug {
  static Codec = codec.Class(Verdict, {
    workReportHash: codec.bytes(HASH_SIZE).asOpaque<WorkReportHash>(),
    votesEpoch: codec.u32.asOpaque<Epoch>(),
    votes: codecWithContext((context) => {
      return codec
        .readonlyArray(codec.sequenceFixLen(Judgement.Codec, context.validatorsSuperMajority))
        .convert<Verdict["votes"]>(seeThrough, asKnownSize);
    }),
  });

```
