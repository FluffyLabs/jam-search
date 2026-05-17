---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L375-L467
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 4
chunk_total: 6
content_sha: bec46dc027c00f4ced68db879cd09a01397b7b7eb104239386614f3a2d7fa407
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 375–467)

```typescript
    const isNewEpoch = isEpochChanged(lastTimeSlot, timeSlot);

    // Generate tickets if within contest period and not yet generated for this epoch
    const epoch = tryAsEpoch(Math.floor(timeSlot / chainSpec.epochLength));

    const slotInEpoch = timeSlot % chainSpec.epochLength;
    const shouldGenerateTickets = slotInEpoch < chainSpec.contestLength && ticketsGeneratedForEpoch !== epoch;

    if (shouldGenerateTickets) {
      const designatedValidatorData = state.designatedValidatorData;
      const ringKeys = designatedValidatorData.map((data) => data.bandersnatch);
      const designatedKeySet = HashSet.from(ringKeys);
      const validatorKeys = keys
        .filter((k) => designatedKeySet.has(k.bandersnatchPublic))
        .map((k) => ({ secret: k.bandersnatchSecret, public: k.bandersnatchPublic }));

      if (validatorKeys.length > 0) {
        // If state is from the previous epoch, entropy hasn't been shifted yet (index 1).
        // After epoch change, it has been shifted to index 2.
        const ticketEntropy = isNewEpoch ? state.entropy[1] : state.entropy[2];

        logger.info`Epoch ${epoch}, slot ${slotInEpoch}/${chainSpec.contestLength}. Generating tickets for ${validatorKeys.length} validators...`;

        const ticketsResult = await generateTickets(
          bandersnatch,
          ringKeys,
          validatorKeys,
          ticketEntropy,
          chainSpec.ticketsPerValidator,
        );

        if (ticketsResult.isError) {
          logger.warn`Failed to generate tickets for epoch ${epoch}: ${ticketsResult.error}`;
        } else {
          logger.log`Generated ${ticketsResult.ok.length} tickets for epoch ${epoch}. Distributing...`;

          // Verify own tickets to get IDs, then add to pool
          await verifyAndAddToPool(epoch, ticketsResult.ok, state);

          // Send directly to network worker (bypasses main thread)
          await networkingComms.sendTickets({ epochIndex: epoch, tickets: ticketsResult.ok });
        }
      }

      ticketsGeneratedForEpoch = epoch;
    }

    const selingKeySeriesResult = await getSealingKeySeries(isNewEpoch, timeSlot, state);

    if (selingKeySeriesResult.isError) {
      continue;
    }

    // On a new epoch, `state.entropy[2]` is the epoch-E entropy (pre-transition);
    // mid-epoch, it has already shifted to `entropy[3]`.
    const entropy = isNewEpoch ? state.entropy[2] : state.entropy[3];

    // Rebuild the authorship cache on each epoch boundary, and also catch the case
    // where the startup prebuild was skipped (e.g. initialState was null or the
    // initial sealing-key transition errored) so we don't silently miss Tickets-mode
    // slots until the next epoch boundary.
    const needsCacheRebuild =
      isNewEpoch ||
      (selingKeySeriesResult.ok.kind === SafroleSealingKeysKind.Tickets && ticketAuthorshipCache === null);
    if (needsCacheRebuild) {
      if (isNewEpoch) {
        logEpochBlockCreation(epoch, selingKeySeriesResult.ok);
      }
      await buildTicketAuthorshipCache(selingKeySeriesResult.ok, entropy);
    }

    const sealData = getSealData(selingKeySeriesResult.ok, keys, timeSlot, entropy);

    if (sealData !== null && currentValidatorData !== null) {
      const { key, sealPayload } = sealData;
      const validatorIndex = getValidatorIndex(key, currentValidatorData);
      if (validatorIndex === null) {
        continue;
      }

      logger.log`Attempting to create a block using ${sealData.logId} located at validator index ${validatorIndex}.`;
      const currentEpochTickets = ticketPool.get(epoch) ?? [];
      const newBlock = await generator.nextBlockView(
        validatorIndex,
        key.bandersnatchSecret,
        sealPayload,
        timeSlot,
        currentEpochTickets, // {ticket, id}[] — already verified
      );
      counter += 1;
      lastGeneratedSlot = timeSlot;
      logger.trace`Sending block ${counter}`;
      await comms.sendBlock(newBlock);
```
