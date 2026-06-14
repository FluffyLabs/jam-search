---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.ts#L374-L472
title: packages/jam/transition/disputes/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 4
chunk_total: 5
content_sha: 25bb646f3e7812b89e7cb14829edac9ca7b3eac91d6337aacacda85f5200f608
language: typescript
---
`packages/jam/transition/disputes/disputes.ts` (lines 374–472)

```typescript
    const signaturesToVerification: VerificationInput = { culprits: [], judgements: [], faults: [] };
    const currentEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);

    for (const { votesEpoch, votes, workReportHash } of disputes.verdicts) {
      const k = votesEpoch === currentEpoch ? this.state.currentValidatorData : this.state.previousValidatorData;
      for (const j of votes) {
        const validator = k[j.index];

        // no particular GP fragment but I think we don't believe in ghosts
        if (validator === undefined) {
          return Result.error(
            DisputesErrorCode.BadValidatorIndex,
            () => `Bad validator index in signature verification: ${j.index}`,
          );
        }

        const key = validator.ed25519;
        // verify vote signature
        // https://graypaper.fluffylabs.dev/#/579bd12/12cd0012cd00
        signaturesToVerification.judgements.push(prepareJudgementSignature(j, workReportHash, key));
      }
    }

    // verify culprit signature
    // https://graypaper.fluffylabs.dev/#/579bd12/125c01125c01
    signaturesToVerification.culprits = disputes.culprits.map(prepareCulpritSignature);

    // verify fault signature
    // https://graypaper.fluffylabs.dev/#/579bd12/12a90112a901
    signaturesToVerification.faults = disputes.faults.map(prepareFaultSignature);

    return Result.ok(signaturesToVerification);
  }

  private getValidatorKeys() {
    const punishSetKeys = this.state.disputesRecords.punishSet;
    const currentValidatorKeys = this.state.currentValidatorData.map((v) => v.ed25519);
    const previousValidatorKeys = this.state.previousValidatorData.map((v) => v.ed25519);
    const allValidatorKeysSet = HashSet.from(currentValidatorKeys.concat(previousValidatorKeys));

    for (const key of punishSetKeys) {
      allValidatorKeysSet.delete(key);
    }

    return allValidatorKeysSet;
  }

  /**
   * Transition the disputes and return a list of offenders.
   */
  async transition(disputes: DisputesExtrinsic): Promise<
    Result<
      {
        offendersMark: HashSet<Ed25519Key>;
        stateUpdate: DisputesStateUpdate;
      },
      DisputesErrorCode
    >
  > {
    const signaturesToVerifyResult = this.prepareSignaturesToVerification(disputes);
    if (signaturesToVerifyResult.isError) {
      return signaturesToVerifyResult;
    }

    const signaturesToVerify = signaturesToVerifyResult.ok;
    const verificationPromise = vefifyAllSignatures(signaturesToVerify);
    const v = this.calculateVotesForWorkReports(disputes);
    const newItems = this.getDisputesRecordsNewItems(v);

    const verificationResult = await verificationPromise;

    const allValidatorKeys = this.getValidatorKeys();

    const inputError = [
      this.verifyVerdicts(disputes, verificationResult),
      this.verifyVotesForWorkReports(v, disputes),
      this.verifyCulprits(disputes, newItems, verificationResult, allValidatorKeys),
      this.verifyFaults(disputes, newItems, verificationResult, allValidatorKeys),
      this.verifyIfAlreadyJudged(disputes),
    ].find((result) => result.isError);

    if (inputError?.isError) {
      return inputError;
    }

    // GP: https://graypaper.fluffylabs.dev/#/579bd12/131300133000
    const offendersMark = this.getOffenders(disputes);
    const disputesRecords = this.getUpdatedDisputesRecords(newItems, offendersMark);
    const availabilityAssignment = this.getClearedCoreAssignment(v);

    return Result.ok({
      offendersMark,
      stateUpdate: {
        disputesRecords,
        availabilityAssignment,
      },
    });
  }
}
```
