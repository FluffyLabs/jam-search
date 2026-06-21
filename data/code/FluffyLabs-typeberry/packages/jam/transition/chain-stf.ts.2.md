---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L189-L301
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 5
content_sha: 5f37864ec21d695db324799f7d46b4c05b77d2d1712e0bbd0d7f033925465bcc
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 189–301)

```typescript
        logger.log`#${timeslot} next epoch ready`;
      } else {
        logger.log`#${timeslot} ${x.details()}`;
      }
      return true;
    });
  }

  private async verifySeal(timeSlot: TimeSlot, block: BlockView) {
    const sealState = this.safrole.getSafroleSealState(timeSlot);
    return await this.safroleSeal.verifyHeaderSeal(block.header.view(), sealState);
  }

  async transition(block: BlockView, headerHash: HeaderHash): Promise<Result<Ok, StfError>> {
    const headerView = block.header.view();
    const header = block.header.materialize();
    const timeSlot = header.timeSlotIndex;

    // reset the epoch cache state
    if (headerView.epochMarker.view() !== null) {
      this.isReadyForNextEpoch = Promise.resolve(false);
    }

    // safrole seal
    const sealResult = await this.verifySeal(timeSlot, block);
    if (sealResult.isError) {
      return stfError(StfErrorKind.SafroleSeal, sealResult);
    }
    const newEntropyHash = sealResult.ok;

    // disputes
    const disputesResult = await this.disputes.transition(block.extrinsic.view().disputes.materialize());
    if (disputesResult.isError) {
      return stfError(StfErrorKind.Disputes, disputesResult);
    }
    const {
      stateUpdate: { disputesRecords, availabilityAssignment: disputesAvailAssignment, ...disputesRest },
      offendersMark,
    } = disputesResult.ok;
    assertEmpty(disputesRest);

    const headerOffendersMark = block.header.view().offendersMarker.materialize();
    const offendersResult = checkOffendersMatch(offendersMark, headerOffendersMark);
    if (offendersResult.isError) {
      return stfError(StfErrorKind.Offenders, offendersResult);
    }

    // safrole
    const safroleResult = await this.safrole.transition({
      slot: timeSlot,
      entropy: newEntropyHash,
      extrinsic: block.extrinsic.view().tickets.materialize(),
      punishSet: disputesRecords.punishSet,
      epochMarker: headerView.epochMarker.view(),
      ticketsMarker: headerView.ticketsMarker.view(),
    });
    if (safroleResult.isError) {
      return stfError(StfErrorKind.Safrole, safroleResult);
    }
    const {
      timeslot,
      ticketsAccumulator,
      sealingKeySeries,
      epochRoot,
      entropy,
      nextValidatorData,
      currentValidatorData,
      previousValidatorData,
      ...safroleRest
    } = safroleResult.ok.stateUpdate;
    assertEmpty(safroleRest);

    // partial recent history
    const recentHistoryPartialUpdate = this.recentHistory.partialTransition({
      priorStateRoot: header.priorStateRoot,
    });
    const { recentBlocks: recentBlocksPartialUpdate, ...recentHistoryPartialRest } = recentHistoryPartialUpdate;
    assertEmpty(recentHistoryPartialRest);

    // assurances
    const assurancesResult = await this.assurances.transition({
      assurances: asKnownSize(block.extrinsic.view().assurances.view()),
      slot: timeSlot,
      parentHash: header.parentHeaderHash,
      disputesAvailAssignment,
    });
    if (assurancesResult.isError) {
      return stfError(StfErrorKind.Assurances, assurancesResult);
    }

    const { availableReports, stateUpdate: assurancesUpdate, ...assurancesRest } = assurancesResult.ok;
    assertEmpty(assurancesRest);

    const { availabilityAssignment: assurancesAvailAssignment, ...assurancesUpdateRest } = assurancesUpdate;
    assertEmpty(assurancesUpdateRest);

    // reports
    const reportsResult = await this.reports.transition({
      slot: timeSlot,
      guarantees: block.extrinsic.view().guarantees.view(),
      newEntropy: entropy,
      recentBlocksPartialUpdate,
      assurancesAvailAssignment,
      offenders: offendersMark,
      currentValidatorData,
      previousValidatorData,
    });
    if (reportsResult.isError) {
      return stfError(StfErrorKind.Reports, reportsResult);
    }

    const { reported: workPackages, reporters, stateUpdate: reportsUpdate, ...reportsRest } = reportsResult.ok;
    assertEmpty(reportsRest);
```
