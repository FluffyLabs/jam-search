---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/disputes.ts#L102-L179
title: packages/jam/block/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c6c1db9f3196ca3d723fe15e915485c463d1b23e56f06bdb9442c6171ad8fbf0
language: typescript
---
`packages/jam/block/disputes.ts` (lines 102–179)

```typescript
    votes: codecWithContext((context) => {
      return codec
        .readonlyArray(codec.sequenceFixLen(Judgement.Codec, context.validatorsSuperMajority))
        .convert<Verdict["votes"]>(seeThrough, asKnownSize);
    }),
  });

  static create({ workReportHash, votesEpoch, votes }: CodecRecord<Verdict>) {
    return new Verdict(workReportHash, votesEpoch, votes);
  }

  private constructor(
    /** Hash of the work report the verdict is for. */
    public readonly workReportHash: WorkReportHash,
    /**
     *  The epoch from which the validators signed the votes.
     *
     *  Must either be the previous epoch or one before that.
     */
    public readonly votesEpoch: Epoch,
    /**
     * Votes coming from super majority of validators.
     *
     * NOTE: must be ordered by validator index.
     * https://graypaper.fluffylabs.dev/#/1c979cb/12b10212b202?v=0.7.1
     */
    public readonly votes: KnownSizeArray<Judgement, "Validators super majority">,
  ) {
    super();
  }
}

/**
 * A collection of judgements (votes over the validity of a [`WorkReport`]) formes a "verdict".
 * Together with offences (`culprits` & `faults`) - judgements and guarantees which dissent with an established
 * "verdict", these form the "disputes" system.
 *
 * `E_D = (v, c, f)`
 *
 * https://graypaper.fluffylabs.dev/#/1c979cb/125d00125d00?v=0.7.1
 */
export class DisputesExtrinsic extends WithDebug {
  static Codec = codec.Class(DisputesExtrinsic, {
    verdicts: codec.sequenceVarLen(Verdict.Codec),
    culprits: codec.sequenceVarLen(Culprit.Codec),
    faults: codec.sequenceVarLen(Fault.Codec),
  });

  static create({ verdicts, culprits, faults }: CodecRecord<DisputesExtrinsic>) {
    return new DisputesExtrinsic(verdicts, culprits, faults);
  }

  private constructor(
    /**
     * `v`: a collection of verdicts over validity of some [`WorkReport`]s.
     *
     *  NOTE: must be ordered by report hash.
     *  https://graypaper.fluffylabs.dev/#/1c979cb/123f02123f02?v=0.7.1
     */
    public readonly verdicts: Verdict[],
    /**
     * `c`: proofs of validator misbehavior: gauranteeing an invalid [`WorkReport`].
     *
     * NOTE: must be ordered by the validator's Ed25519Key.
     * https://graypaper.fluffylabs.dev/#/1c979cb/124102124102?v=0.7.1
     */
    public readonly culprits: Culprit[],
    /**
     * `f`: proofs of validator misbehavior: signing a contradictory judgement of a [`WorkReport`] validity.
     *
     * NOTE: must be ordered by the validator's Ed25519Key.
     * https://graypaper.fluffylabs.dev/#/1c979cb/124102124102?v=0.7.1
     */
    public readonly faults: Fault[],
  ) {
    super();
  }
}
```
