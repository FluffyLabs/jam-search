---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L274-L379
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 3
chunk_total: 6
content_sha: 976f9f7e3ae4b37b2c58fa27a082b3e396bfa25956d57a9671dbe7ad92c68295
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 274–379)

```typescript
      ticketPool.clear();
      ticketIdSets.clear();
    }
    const existing = ticketPool.get(epochIndex) ?? [];
    let idSet = ticketIdSets.get(epochIndex) ?? null;
    if (idSet === null) {
      idSet = HashSet.new();
      ticketIdSets.set(epochIndex, idSet);
    }
    for (const entry of verifiedTickets) {
      if (!idSet.has(entry.id)) {
        existing.push(entry);
        idSet.insert(entry.id);
      }
    }
    ticketPool.set(epochIndex, existing);
  }

  /**
   * Returns the correct tickets entropy for verification given the current state.
   *
   * When `state` is from epoch E-1 (i.e. we haven't produced epoch E's first block yet),
   * the ticket entropy for epoch E is at index 1 (not yet shifted).
   * After the epoch transition it moves to index 2.
   */
  function getTicketEntropy(epochIndex: number, state: State): EntropyHash {
    const stateEpoch = Math.floor(state.timeslot / chainSpec.epochLength);
    return epochIndex > stateEpoch ? state.entropy[1] : state.entropy[2];
  }

  /**
   * Verifies tickets against the ring commitment and current epoch entropy, then adds valid
   * ones to the pool with their computed IDs.
   *
   * Called both for own generated tickets and for tickets relayed from peers.
   * Verification computes the ticket ID (entropyHash) which is then used for
   * deduplication in the pool and later when building the extrinsic.
   */
  async function verifyAndAddToPool(epochIndex: number, tickets: SignedTicket[], state: State): Promise<boolean> {
    const results = await bandersnatchVrf.verifyTickets(
      bandersnatch,
      state.designatedValidatorData.length,
      state.epochRoot,
      tickets,
      getTicketEntropy(epochIndex, state),
    );
    if (results.length !== tickets.length) {
      logger.error`verifyTickets returned ${results.length} results for ${tickets.length} tickets`;
      return false;
    }
    const verified = tickets
      .map((ticket, i) => ({ ticket, id: results[i].entropyHash }))
      .filter((_, i) => results[i].isValid);
    addToPool(epochIndex, verified);
    return verified.length > 0;
  }

  // Receive a single ticket from peers (via jam-network worker).
  // Returns true if the ticket passed validation so jam-network can decide whether to redistribute it.
  networkingComms.setOnReceivedTickets(async ({ epochIndex, ticket }) => {
    logger.log`Received ticket from peer for epoch ${epochIndex}`;
    const hash = blocks.getBestHeaderHash();
    const state = states.getState(hash);
    if (state === null) {
      logger.warn`Cannot verify received ticket: no state available`;
      return false;
    }
    return await verifyAndAddToPool(epochIndex, [ticket], state);
  });

  const isFastForward = config.workerParams.isFastForward;
  let lastGeneratedSlot = startTimeSlot;
  let ticketsGeneratedForEpoch = -1;

  while (!isFinished) {
    const hash = blocks.getBestHeaderHash();
    const state = states.getState(hash);
    const currentValidatorData = state?.currentValidatorData ?? null;

    if (state === null) {
      continue;
    }

    const lastTimeSlot = state.timeslot;

    /**
     * In fastForward mode, use simulated time (next slot after current state).
     * In normal mode, use wall clock time.
     * Assuming `slotDuration` is 6 sec it is safe till year 2786.
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

```
