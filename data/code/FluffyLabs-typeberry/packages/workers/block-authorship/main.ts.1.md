---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L96-L182
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 4
content_sha: 30f741e2836e3873d8351cc94f6a50f4ac74facddd44a666e183724012b8ebc0
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 96–182)

```typescript
  // Generate blocks until the close signal is received.
  let isFinished = false;
  comms.setOnFinish(async () => {
    isFinished = true;
  });

  let ticketGeneratorDone = Promise.resolve();

  while (!isFinished) {
    const state = getBestState();

    // query current expected time slot
    const stateTimeSlot = state.timeslot;
    const newTimeSlot = timeSlotHandler.getCurrentTimeSlot(stateTimeSlot);
    const epochPhase = newTimeSlot % chainSpec.epochLength;

    // Seems that the epoch is changing, let's transition
    if (epochData === null || epochTracker.isEpochChanged(stateTimeSlot, newTimeSlot)) {
      const oldEpochData = epochData;
      const epochDataResult = await epochTracker.getEpochData(logger, state, newTimeSlot);
      if (epochDataResult.isError) {
        // Couldn't compute the sealing keys for this epoch — wait and retry rather
        // than crashing the worker (`epochData` keeps its previous value, if any).
        logger.warn`[#${newTimeSlot}] Could not compute epoch data: ${epochDataResult.details()}`;
        await timeSlotHandler.waitForNextSlot(false, epochPhase, ticketGeneratorDone);
        continue;
      }
      epochData = epochDataResult.ok;
      const epochIndex = epochData.epoch;
      if (oldEpochData === null) {
        logger.info`🎁 [E${epochIndex}#${newTimeSlot}] starting authorship (state at #${stateTimeSlot})`;
      } else {
        logger.info`🎁 [E${oldEpochData.epoch}#${stateTimeSlot} -> E${epochIndex}#${newTimeSlot}] epoch transition`;
      }

      // On every epoch boundary, push the authoritative ticket pool to networking so it
      // can replace its redistribution set; this keeps the two sides from drifting.
      const tickets = verifiedPool.getForEpoch(epochIndex).map((entry) => entry.ticket);
      await networkingComms.sendReplaceTicketPool({
        epochIndex,
        tickets,
      });

      // Let's generate some tickets for the next epoch if we still have time
      if (epochPhase < chainSpec.contestLength) {
        const generatingForEpoch = epochData.epoch;
        const isEpochStart = epochPhase === 0;
        ticketGeneratorDone = ticketGenerator.generateTickets(state, isEpochStart, async (tickets) => {
          // too late!
          if (generatingForEpoch !== epochData?.epoch) {
            return;
          }
          const isValid = await onEpochTickets(generatingForEpoch, tickets, "generator");
          // Push our freshly generated tickets to networking so they're redistributed
          // to peers (who include them in their blocks). Without this, a multi-node
          // network never shares tickets and accumulators only ever hold local ones.
          if (isValid) {
            await networkingComms.sendTickets({ epochIndex: generatingForEpoch, tickets });
          }
        });
      }
    }

    const logPrefix = `[E${epochData.epoch}#${newTimeSlot}]`;

    // author a block if we are assigned to that slot
    const currentSlot = epochData.slots[epochPhase];
    if (currentSlot !== null) {
      const { logId, key, sealPayload } = currentSlot;
      // figure out validator index
      const validatorIndex = getValidatorIndex(key.bandersnatchPublic, state.currentValidatorData);
      if (validatorIndex === null) {
        logger.log`${logPrefix} Not currently validator, yet ${currentSlot.logId} is present.`;
        // Don't spin: wait for the next slot before re-checking (otherwise this is
        // a tight hot loop until some other component advances the DB).
        await timeSlotHandler.waitForNextSlot(false, epochPhase, ticketGeneratorDone);
        continue;
      }

      logger.log`${logPrefix} Creating block using ${logId} (valIdx: ${validatorIndex})`;
      // retrieve epoch tickets to include
      const currentEpochTickets = verifiedPool.getForEpoch(epochData.epoch);
      const newBlock = await generator.nextBlockView(
        validatorIndex,
        key.bandersnatchSecret,
        sealPayload,
        newTimeSlot,
```
