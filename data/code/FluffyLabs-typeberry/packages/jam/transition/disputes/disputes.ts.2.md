---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.ts#L187-L292
title: packages/jam/transition/disputes/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 5
content_sha: 56ec535c672f1b130316978f308cbdaa7d0d99a1a37b1a5d89e0bfda7458da11
language: typescript
---
`packages/jam/transition/disputes/disputes.ts` (lines 187–292)

```typescript
      for (const { index } of votes) {
        const key = k[index]?.ed25519;

        // no particular GP fragment but I think we don't believe in ghosts
        if (key === undefined) {
          return Result.error(
            DisputesErrorCode.BadValidatorIndex,
            () => `Bad validator index: ${index} in epoch ${votesEpoch}`,
          );
        }

        // verify vote signature. Verification was done earlier, here we only check the result.
        // https://graypaper.fluffylabs.dev/#/579bd12/12cd0012cd00
        const result = verificationResult.judgements[voteSignatureIndex];
        if (!result.isValid) {
          return Result.error(
            DisputesErrorCode.BadSignature,
            () => `Invalid signature for judgement: ${voteSignatureIndex}`,
          );
        }
        voteSignatureIndex += 1;
      }
    }

    return Result.ok(null);
  }

  private verifyIfAlreadyJudged(disputes: DisputesExtrinsic): Result<Ok, DisputesErrorCode> {
    for (const verdict of disputes.verdicts) {
      // current verdicts should not be reported earlier
      // https://graypaper.fluffylabs.dev/#/579bd12/122202122202
      const { goodSet, badSet, wonkySet } = this.state.disputesRecords.asDictionaries();
      const isInGoodSet = goodSet.has(verdict.workReportHash);
      const isInBadSet = badSet.has(verdict.workReportHash);
      const isInWonkySet = wonkySet.has(verdict.workReportHash);

      if (isInGoodSet || isInBadSet || isInWonkySet) {
        return Result.error(
          DisputesErrorCode.AlreadyJudged,
          () => `Work report already judged: ${verdict.workReportHash}`,
        );
      }
    }

    return Result.ok(null);
  }

  private calculateVotesForWorkReports(disputes: DisputesExtrinsic) {
    // calculate total votes for each work report
    // https://graypaper.fluffylabs.dev/#/579bd12/128c0212e302
    const v = HashDictionary.new<WorkReportHash, number>();

    for (const verdict of disputes.verdicts) {
      const j = verdict.votes;
      const r = verdict.workReportHash;

      let sum = 0;
      for (const { isWorkReportValid } of j) {
        if (isWorkReportValid) {
          sum += 1;
        }
      }

      v.set(r, sum);
    }

    return v;
  }

  private verifyVotesForWorkReports(
    v: VotesForWorkReports,
    disputes: DisputesExtrinsic,
  ): Result<Ok, DisputesErrorCode> {
    // verify if the vote split is correct and if number of faults/culprits is correct
    // https://graypaper.fluffylabs.dev/#/579bd12/12fb02121003

    for (const [r, sum] of v) {
      if (sum === this.chainSpec.validatorsSuperMajority) {
        // there has to be at least 1 fault with the same work report hash
        // https://graypaper.fluffylabs.dev/#/579bd12/12f10212fc02
        const f = disputes.faults.find((x) => x.workReportHash.isEqualTo(r));
        if (f === undefined) {
          return Result.error(DisputesErrorCode.NotEnoughFaults, () => `Not enough faults for work report: ${r}`);
        }
      } else if (sum === 0) {
        // there has to be at least 2 culprits with the same work report hash
        // https://graypaper.fluffylabs.dev/#/579bd12/120c03121003
        const c1 = disputes.culprits.find((x) => x.workReportHash.isEqualTo(r));
        const c2 = disputes.culprits.findLast((x) => x.workReportHash.isEqualTo(r));
        if (c1 === c2) {
          return Result.error(DisputesErrorCode.NotEnoughCulprits, () => `Not enough culprits for work report: ${r}`);
        }
      } else if (sum !== this.chainSpec.thirdOfValidators) {
        // positive votes count is not correct
        // https://graypaper.fluffylabs.dev/#/579bd12/125002128102
        return Result.error(
          DisputesErrorCode.BadVoteSplit,
          () => `Bad vote split: sum=${sum}, expected=${this.chainSpec.thirdOfValidators} for work report ${r}`,
        );
      }
    }

    return Result.ok(null);
  }

  private getDisputesRecordsNewItems(v: VotesForWorkReports) {
```
