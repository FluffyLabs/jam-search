---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L191-L301
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 5
content_sha: 2494551b94cb3c1979b7979c1a9a3eea3b844f6d4c6ab0ef8dd7f7b14f034c1b
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 191–301)

```typescript
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
    const { availabilityAssignment: reportsAvailAssignment, ...reportsUpdateRest } = reportsUpdate;
    assertEmpty(reportsUpdateRest);

    // preimages
    const preimagesResult = this.preimages.integrate({
      slot: timeSlot,
      preimages: block.extrinsic.view().preimages.materialize(),
    });
    if (preimagesResult.isError) {
      return stfError(StfErrorKind.Preimages, preimagesResult);
    }
```
