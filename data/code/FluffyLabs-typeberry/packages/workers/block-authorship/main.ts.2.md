---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L207-L301
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 3
content_sha: 9b78628e807df80cf03bd026ed4abdbe9a2dfce49149b823a7d5322cf490cf7e
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 207–301)

```typescript
     * If `slotDuration` is 1 sec then it is safe till 2106.
     */
    const timeSlot =
      isFastForward === true
        ? tryAsTimeSlot(lastTimeSlot + 1)
        : tryAsTimeSlot(Number(getTime() / 1000n / BigInt(chainSpec.slotDuration)));

    // In fastForward mode, skip if we already generated for this slot (waiting for import)
    if (isFastForward === true && timeSlot <= lastGeneratedSlot) {
      continue;
    }

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

    if (isNewEpoch) {
      logEpochBlockCreation(epoch, selingKeySeriesResult.ok);
    }

    const key = getKeyForCurrentSlot(selingKeySeriesResult.ok, keys, timeSlot);

    if (key !== null && currentValidatorData !== undefined) {
      const validatorIndex = getValidatorIndex(key, currentValidatorData);
      if (validatorIndex === null) {
        continue;
      }

      logger.log`Attempting to create a block using key ${key.bandersnatchPublic} located at validator index ${validatorIndex}.`;
      const entropy = isNewEpoch ? state.entropy[2] : state.entropy[3];
      const sealPayload = getSealPayload(selingKeySeriesResult.ok, entropy);
      const newBlock = await generator.nextBlockView(validatorIndex, key.bandersnatchSecret, sealPayload, timeSlot);
      counter += 1;
      lastGeneratedSlot = timeSlot;
      logger.trace`Sending block ${counter}`;
      await comms.sendBlock(newBlock);
    } else if (isFastForward === true) {
      // In fast-forward mode, if this slot is not ours, wait briefly for other validators to produce blocks
      await setTimeout(10);
    }

    if (isFastForward === false) {
      await setTimeout(chainSpec.slotDuration * 1000);
    }
  }

  logger.info`🎁 Block Authorship finished. Closing channel.`;
  await db.close();
}
```
