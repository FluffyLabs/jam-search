---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/block-generator.ts#L107-L206
title: packages/workers/block-authorship/block-generator.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 3
content_sha: f474c0a9af638f18387aeed827bf17f029b4c8ec1327d561e48f959518c8e924
language: typescript
---
`packages/workers/block-authorship/block-generator.ts` (lines 107–206)

```typescript
   * In either case (Tickets or Keys) the value returned here DOES not depend on the header
   * data (i.e. the `aux_data`) so we are able to compute it beforehand.
   */
  private async getEntropyHash(
    sealPayload: BytesBlob,
    bandersnatchSecret: BandersnatchSecretSeed,
  ): Promise<Result<VrfOutputHash, null>> {
    const entropyHashResult = await bandersnatchVrf.getVrfOutputHash(
      this.bandersnatch,
      bandersnatchSecret,
      sealPayload,
    );

    if (entropyHashResult.isError) {
      return Result.error(null, () => "Entropy hash generation failed");
    }

    return entropyHashResult;
  }

  /**
   * Selects tickets to include in the extrinsic from the pending pool.
   *
   * Tickets were already verified at receipt time (IDs pre-computed). This method:
   * 1. Filters out tickets whose IDs are already in `state.ticketsAccumulator` (already processed).
   * 2. Sorts remaining tickets by ID ascending (required by Safrole).
   * 3. Deduplicates by ID (pool dedup is best-effort; reorgs can produce duplicates).
   * 4. Returns at most `chainSpec.maxTicketsPerExtrinsic` tickets.
   *
   * Called only during the contest period (slotInEpoch < contestLength).
   */
  private prepareTicketsExtrinsic(
    pendingTickets: { ticket: SignedTicket; id: EntropyHash }[],
    state: ReturnType<BlockGenerator["getLastHeaderAndState"]>["lastState"],
  ): SignedTicket[] {
    if (pendingTickets.length === 0) {
      return [];
    }

    // Tickets are already verified at receipt time — just filter, sort and slice.
    // Build a set of ticket IDs already in the state accumulator for fast lookup.
    const accumulatedIds = HashSet.from(state.ticketsAccumulator.map((t) => t.id));

    const filtered = pendingTickets.filter(({ id }) => !accumulatedIds.has(id));

    // Sort by ID ascending
    filtered.sort((a, b) => a.id.compare(b.id).value);

    // Deduplicate by ID (pool dedup is best-effort; state may produce duplicates across reorgs)
    const deduped: typeof filtered = [];
    for (const item of filtered) {
      if (deduped.length === 0 || !deduped[deduped.length - 1].id.isEqualTo(item.id)) {
        deduped.push(item);
      }
    }

    return deduped.slice(0, this.chainSpec.maxTicketsPerExtrinsic).map(({ ticket }) => ticket);
  }

  async nextBlock(
    validatorIndex: ValidatorIndex,
    bandersnatchSecret: BandersnatchSecretSeed,
    sealPayload: BlockSealInput,
    timeSlot: TimeSlot,
    pendingTickets: { ticket: SignedTicket; id: EntropyHash }[] = [],
  ) {
    this.metrics.recordBlockAuthoringStarted(timeSlot);
    const startTime = now();
    // fetch latest data from the db.
    const { lastHeaderHash, lastState } = this.getLastHeaderAndState();

    // generate entropy hash first (NOTE this might be coming from a ticket)
    const entropyHashRes = await this.getEntropyHash(sealPayload, bandersnatchSecret);
    if (entropyHashRes.isError) {
      throw new Error(`Entropy hash generation failed: ${entropyHashRes.error}`);
    }
    const entropyHash = entropyHashRes.ok;
    logger.trace`Generated entropy: ${entropyHash} for block @${timeSlot}`;

    // create the signature for source of entropy
    const entropySource = await bandersnatchVrf.generateSeal(
      this.bandersnatch,
      bandersnatchSecret,
      BytesBlob.blobFromParts([JAM_ENTROPY, entropyHash.raw]),
      EMPTY_AUX_DATA,
    );
    if (entropySource.isError) {
      throw new Error(`Entropy source generation failed: ${entropySource.error}`);
    }

    // retrieve data from previous block
    const hasher = TransitionHasher.new(this.keccakHasher, this.blake2b);
    const stateRoot = this.states.getStateRoot(lastState);

    const slotInEpoch = timeSlot % this.chainSpec.epochLength;
    const isContestPeriod = slotInEpoch < this.chainSpec.contestLength;

    // Include tickets only during contest period
    const ticketsForExtrinsic = isContestPeriod ? await this.prepareTicketsExtrinsic(pendingTickets, lastState) : [];

```
