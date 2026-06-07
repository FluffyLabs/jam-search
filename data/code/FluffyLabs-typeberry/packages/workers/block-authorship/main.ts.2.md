---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L183-L280
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 6
content_sha: f4806bf90492b28a8dc0f97ade9f31eefe6eb205d6a3aa3a458cf9d004dca217
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 183–280)

```typescript
   * startup and on every epoch transition, so we never fall back to on-the-fly VRF).
   */
  function getSealData(
    sealingKeySeries: SafroleSealingKeys,
    keys: ValidatorKeys[],
    timeSlot: TimeSlot,
    entropy: EntropyHash,
  ): SealData | null {
    if (sealingKeySeries.kind === SafroleSealingKeysKind.Keys) {
      const indexForCurrentSlot = timeSlot % sealingKeySeries.keys.length;
      const sealingKey = sealingKeySeries.keys[indexForCurrentSlot];
      const key = keys.find((x) => x.bandersnatchPublic.isEqualTo(sealingKey)) ?? null;
      if (key === null) {
        return null;
      }

      return {
        key,
        sealPayload: getFallbackSealPayload(entropy),
        logId: `key ${key.bandersnatchPublic}`,
      };
    }

    // Tickets mode: each slot is sealed by the validator who can produce the VRF output
    // matching the ticket's ID for that slot.
    const index = timeSlot % sealingKeySeries.tickets.length;
    const ticket = sealingKeySeries.tickets.at(index) ?? null;
    const cached = ticketAuthorshipCache?.at(index) ?? null;
    if (ticket === null || cached === null) {
      return null;
    }
    return { ...cached, logId: `ticket ${ticket.id} (attempt ${ticket.attempt})` };
  }

  function isEpochChanged(lastTimeslot: TimeSlot, currentTimeslot: TimeSlot): boolean {
    const lastEpoch = Math.floor(lastTimeslot / chainSpec.epochLength);
    const currentEpoch = Math.floor(currentTimeslot / chainSpec.epochLength);
    return currentEpoch > lastEpoch;
  }

  function logEpochBlockCreation(epoch: Epoch, sealingKeySeries: SafroleSealingKeys) {
    if (sealingKeySeries.kind === SafroleSealingKeysKind.Tickets) {
      logger.info`[EPOCH ${epoch}] Tickets mode active with ${sealingKeySeries.tickets.length} tickets.`;
      return;
    }

    let isCreating = false;
    const epochStart = epoch * chainSpec.epochLength;
    const epochEnd = epochStart + chainSpec.epochLength;
    for (let slot = epochStart; slot < epochEnd; slot++) {
      const indexForCurrentSlot = slot % sealingKeySeries.keys.length;
      const sealingKey = sealingKeySeries.keys[indexForCurrentSlot];
      const key = keys.find((x) => x.bandersnatchPublic.isEqualTo(sealingKey)) ?? null;
      if (key !== null) {
        isCreating = true;
        logger.info`[EPOCH ${epoch}] Validator ${key.bandersnatchPublic.toString()} will author block at slot ${slot}`;
      }
    }

    if (isCreating === false) {
      logger.info`[EPOCH ${epoch}] No blocks to author for this epoch.`;
    }
  }

  async function getSealingKeySeries(isNewEpoch: boolean, timeSlot: TimeSlot, state: State) {
    if (isNewEpoch) {
      const safrole = new Safrole(chainSpec, blake2bHasher, state);
      return await safrole.getSealingKeySeries({
        entropy: state.entropy[1],
        slot: timeSlot,
        punishSet: state.disputesRecords.punishSet,
      });
    }

    return Result.ok(state.sealingKeySeries);
  }

  // Ticket pool: epochIndex -> {ticket, id}[]
  // IDs (entropyHash) are computed at receipt time via verifyTickets(), enabling O(1) dedup by ID.
  const ticketPool = new Map<number, { ticket: SignedTicket; id: EntropyHash }[]>();
  const ticketIdSets = new Map<number, HashSet<EntropyHash>>();

  /**
   * Adds pre-verified tickets to the in-memory ticket pool for the given epoch.
   *
   * Clears the pool when the epoch changes (we only ever need tickets for one epoch at a time).
   * Deduplicates by ticket ID using a HashSet for O(1) lookup — prevents double-counting
   * tickets received from multiple peers or via both CE-131 and CE-132 paths.
   */
  function addToPool(epochIndex: number, verifiedTickets: { ticket: SignedTicket; id: EntropyHash }[]) {
    if (ticketPool.size > 0 && !ticketPool.has(epochIndex)) {
      ticketPool.clear();
      ticketIdSets.clear();
    }
    const existing = ticketPool.get(epochIndex) ?? [];
    let idSet = ticketIdSets.get(epochIndex) ?? null;
    if (idSet === null) {
      idSet = HashSet.new();
```
