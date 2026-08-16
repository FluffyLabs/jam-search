---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.ts#L284-L377
title: packages/jam/transition/disputes/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 5
content_sha: f90c2ed9fc211a0cf57b4c739e9a93a00fb90a25fcb6b5dac0cc35c328570d33
language: typescript
---
`packages/jam/transition/disputes/disputes.ts` (lines 284–377)

```typescript
          () => `Bad vote split: sum=${sum}, expected=${this.chainSpec.thirdOfValidators} for work report ${r}`,
        );
      }
    }

    return Result.ok(null);
  }

  private getDisputesRecordsNewItems(v: VotesForWorkReports) {
    const toAddToGoodSet: WorkReportHash[] = [];
    const toAddToBadSet: WorkReportHash[] = [];
    const toAddToWonkySet: WorkReportHash[] = [];

    // prepare new disputes records items but do not update the state yet
    // the state will be updated after verification
    // https://graypaper.fluffylabs.dev/#/579bd12/124a0312a503
    for (const [r, sum] of v) {
      if (sum >= this.chainSpec.validatorsSuperMajority) {
        toAddToGoodSet.push(r);
      } else if (sum === 0) {
        toAddToBadSet.push(r);
      } else if (sum >= this.chainSpec.thirdOfValidators) {
        toAddToWonkySet.push(r);
      }
    }

    return DisputesRecords.create({
      goodSet: SortedSet.fromArrayUnique(hashComparator, toAddToGoodSet),
      badSet: SortedSet.fromArrayUnique(hashComparator, toAddToBadSet),
      wonkySet: SortedSet.fromArrayUnique(hashComparator, toAddToWonkySet),
      punishSet: SortedSet.fromArray<Ed25519Key>(hashComparator, []),
    });
  }

  /**
   * ρ†
   * We clear any work-reports which we judged as uncertain or invalid from their core.
   * https://graypaper.fluffylabs.dev/#/1c979cb/136900139e00?v=0.7.1
   */
  private getClearedCoreAssignment(v: VotesForWorkReports): PerCore<AvailabilityAssignment | null> {
    // count how many votes we have left to process
    let votesLeft = v.size;
    // go through each core and check for results, but early exit if
    // there is no more votes to process
    const availabilityAssignment = this.state.availabilityAssignment.slice();
    for (let c = 0; c < availabilityAssignment.length && votesLeft > 0; c++) {
      const assignment = availabilityAssignment[c];
      if (assignment !== null) {
        const encoded = Encoder.encodeObject(WorkReport.Codec, assignment.workReport, this.chainSpec);
        const hash: WorkReportHash = this.blake2b.hashBytes(encoded).asOpaque();
        const sum = v.get(hash);
        if (sum !== undefined) {
          votesLeft--;
          if (sum < this.chainSpec.validatorsSuperMajority) {
            availabilityAssignment[c] = null;
          }
        }
      }
    }
    return tryAsPerCore(availabilityAssignment, this.chainSpec);
  }

  private getOffenders(disputes: DisputesExtrinsic) {
    // https://graypaper.fluffylabs.dev/#/579bd12/12bb0312bb03
    const offendersMarks = HashSet.new<Ed25519Key>();

    for (const { key } of disputes.culprits) {
      offendersMarks.insert(key);
    }

    for (const { key } of disputes.faults) {
      offendersMarks.insert(key);
    }

    return offendersMarks;
  }

  private getUpdatedDisputesRecords(newItems: DisputesRecords, offenders: HashSet<Ed25519Key>): DisputesRecords {
    const toAddToPunishSet = SortedArray.fromArray(hashComparator, Array.from(offenders));
    return DisputesRecords.create({
      // https://graypaper.fluffylabs.dev/#/579bd12/12690312bc03
      goodSet: SortedSet.fromTwoSortedCollections(this.state.disputesRecords.goodSet, newItems.goodSet),
      badSet: SortedSet.fromTwoSortedCollections(this.state.disputesRecords.badSet, newItems.badSet),
      wonkySet: SortedSet.fromTwoSortedCollections(this.state.disputesRecords.wonkySet, newItems.wonkySet),
      punishSet: SortedSet.fromTwoSortedCollections(this.state.disputesRecords.punishSet, toAddToPunishSet),
    });
  }

  private prepareSignaturesToVerification(disputes: DisputesExtrinsic): Result<VerificationInput, DisputesErrorCode> {
    // Signature verification is heavy so we prepare data to verify it in the meantime,
    const signaturesToVerification: VerificationInput = { culprits: [], judgements: [], faults: [] };
    const currentEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);

    for (const { votesEpoch, votes, workReportHash } of disputes.verdicts) {
```
