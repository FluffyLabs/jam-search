---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.ts#L99-L192
title: packages/jam/transition/disputes/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 8996709f5254c9132de0dda4bd4ec14ebee6436a1e60f64948bfcef9fda6de34
language: typescript
---
`packages/jam/transition/disputes/disputes.ts` (lines 99–192)

```typescript
    if (!isUniqueSortedBy(disputes.faults, "key")) {
      return Result.error(DisputesErrorCode.FaultsNotSortedUnique, () => "Faults are not uniquely sorted by key");
    }

    const faultsLength = disputes.faults.length;
    for (let i = 0; i < faultsLength; i++) {
      const { key, workReportHash, wasConsideredValid } = disputes.faults[i];
      // check if some offenders weren't reported earlier
      // https://graypaper.fluffylabs.dev/#/579bd12/12a20112a201
      const isInPunishSet = this.state.disputesRecords.asDictionaries().punishSet.has(key);

      if (isInPunishSet) {
        return Result.error(
          DisputesErrorCode.OffenderAlreadyReported,
          () => `Offender already reported: fault ${i}, key=${key}`,
        );
      }

      // check if the auditor key is correct
      // https://graypaper.fluffylabs.dev/#/85129da/12a20112a201?v=0.6.3
      if (!allValidatorKeys.has(key)) {
        return Result.error(DisputesErrorCode.BadAuditorKey, () => `Bad auditor key: fault ${i}, key=${key}`);
      }

      // verify if the fault will be included in new good/bad set
      // it may be not correct as in GP there is "iff" what means it should be rather
      // if (!wasConsideredValid || isInNewGoodSet || !isInNewBadSet) return DisputesErrorCode.FaultVerdictWrong;
      // but it does not pass the tests
      // https://graypaper.fluffylabs.dev/#/579bd12/128a01129601
      if (wasConsideredValid) {
        const { goodSet, badSet } = newItems.asDictionaries();
        const isInNewGoodSet = goodSet.has(workReportHash);
        const isInNewBadSet = badSet.has(workReportHash);

        if (isInNewGoodSet || !isInNewBadSet) {
          return Result.error(
            DisputesErrorCode.FaultVerdictWrong,
            () =>
              `Fault verdict wrong: fault ${i}, work report=${workReportHash}, inGood=${isInNewGoodSet}, inBad=${isInNewBadSet}`,
          );
        }
      }

      // verify fault signature. Verification was done earlier, here we only check the result.
      // https://graypaper.fluffylabs.dev/#/579bd12/12a90112a901
      const result = verificationResult.faults[i];
      if (!result.isValid) {
        return Result.error(DisputesErrorCode.BadSignature, () => `Invalid signature for fault: ${i}`);
      }
    }

    return Result.ok(null);
  }

  private verifyVerdicts(
    disputes: DisputesExtrinsic,
    verificationResult: VerificationOutput,
  ): Result<Ok, DisputesErrorCode> {
    // check if verdicts are correctly sorted
    // https://graypaper.fluffylabs.dev/#/579bd12/12c40112c401
    if (!isUniqueSortedBy(disputes.verdicts, "workReportHash")) {
      return Result.error(
        DisputesErrorCode.VerdictsNotSortedUnique,
        () => "Verdicts are not uniquely sorted by work report hash",
      );
    }

    // check if judgement are correctly sorted
    // https://graypaper.fluffylabs.dev/#/579bd12/123702123802
    if (disputes.verdicts.some((verdict) => !isUniqueSortedByIndex(verdict.votes))) {
      return Result.error(
        DisputesErrorCode.JudgementsNotSortedUnique,
        () => "Judgements are not uniquely sorted by index",
      );
    }

    const currentEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    let voteSignatureIndex = 0;
    for (const { votesEpoch, votes } of disputes.verdicts) {
      // https://graypaper.fluffylabs.dev/#/579bd12/12bb0012bc00
      if (votesEpoch !== currentEpoch && votesEpoch + 1 !== currentEpoch) {
        return Result.error(
          DisputesErrorCode.BadJudgementAge,
          () => `Bad judgement age: epoch=${votesEpoch}, current=${currentEpoch}`,
        );
      }

      const k = votesEpoch === currentEpoch ? this.state.currentValidatorData : this.state.previousValidatorData;
      for (const { index } of votes) {
        const key = k[index]?.ed25519;

        // no particular GP fragment but I think we don't believe in ghosts
        if (key === undefined) {
          return Result.error(
```
