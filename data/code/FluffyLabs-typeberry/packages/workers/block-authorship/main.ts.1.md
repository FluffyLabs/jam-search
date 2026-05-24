---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L107-L190
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 6
content_sha: 961b0cb5ef94733182deda5bc81e9b81fa263900b17d61fe22ee308d51f88da8
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 107–190)

```typescript
  logger.info`Block authorship validator keys: ${keys.map(({ bandersnatchPublic }, index) => `\n ${index}: ${bandersnatchPublic.toString()}`)}`;

  // Per-epoch cache for Tickets mode: index corresponds to position in sealingKeySeries.tickets.
  // null entry means none of our keys match that slot.
  // Rebuilt once per epoch via buildTicketAuthorshipCache().
  // Declared here (before the eager startup build below) so its TDZ doesn't fire
  // when `buildTicketAuthorshipCache` runs during initialisation.
  let ticketAuthorshipCache: Array<SealData | null> | null = null;

  if (initialState !== null) {
    const isEpochStart = startTimeSlot % chainSpec.epochLength === 0;
    const initialKeys = await getSealingKeySeries(isEpochStart, startTimeSlot, initialState);
    if (initialKeys.isOk) {
      logEpochBlockCreation(tryAsEpoch(Math.floor(startTimeSlot / chainSpec.epochLength)), initialKeys.ok);
      // Build the cache eagerly so the first slot of a session doesn't need an
      // on-the-fly VRF scan. After this, `buildTicketAuthorshipCache` is only
      // re-run on epoch boundaries.
      const initialEntropy = isEpochStart ? initialState.entropy[2] : initialState.entropy[3];
      await buildTicketAuthorshipCache(initialKeys.ok, initialEntropy);
    }
  }

  function getTime() {
    const currentTime = process.hrtime.bigint() / 1_000_000n;
    const timeFromStart = currentTime - startTime;
    const slotDurationMs = BigInt(chainSpec.slotDuration * 1000);
    return tryAsU64(BigInt(startTimeSlot) * slotDurationMs + timeFromStart + slotDurationMs);
  }

  function getValidatorIndex(key: ValidatorKeys, currentValidatorData: PerValidator<ValidatorData>) {
    const index = currentValidatorData.findIndex((data) => data.bandersnatch.isEqualTo(key.bandersnatchPublic));
    if (index < 0) {
      return null;
    }
    return tryAsValidatorIndex(index);
  }

  /**
   * Precomputes which slots we are the author of for the current epoch (Tickets mode).
   */
  async function buildTicketAuthorshipCache(sealingKeySeries: SafroleSealingKeys, entropy: EntropyHash) {
    if (sealingKeySeries.kind !== SafroleSealingKeysKind.Tickets) {
      ticketAuthorshipCache = null;
      return;
    }

    const ownTickets = new HashDictionary<EntropyHash, SealData>();
    for (let attempt = 0; attempt < chainSpec.ticketsPerValidator; attempt++) {
      const payload = getTicketSealPayload(entropy, attempt);
      for (const key of keys) {
        const result = await bandersnatchVrf.getVrfOutputHash(bandersnatch, key.bandersnatchSecret, payload);
        if (result.isOk) {
          ownTickets.set(result.ok.asOpaque<EntropyHash>(), { key, sealPayload: asOpaqueType(payload) });
        }
      }
    }

    const cache = sealingKeySeries.tickets.map((ticket) => ownTickets.get(ticket.id.asOpaque<EntropyHash>()) ?? null);
    ticketAuthorshipCache = cache;
    const ours = cache.filter(Boolean).length;
    logger.info`Built ticket authorship cache: ${ours}/${cache.length} slots assigned to us this epoch.`;
  }

  function getTicketSealPayload(entropy: EntropyHash, attempt: number): BytesBlob {
    return BytesBlob.blobFromParts(JAM_TICKET_SEAL, entropy.raw, new Uint8Array([attempt]));
  }

  function getFallbackSealPayload(entropy: EntropyHash): BlockSealInput {
    return asOpaqueType(BytesBlob.blobFromParts(JAM_FALLBACK_SEAL, entropy.raw));
  }

  /**
   * Returns the validator key and seal payload for the current slot, or null if we are not the author.
   *
   * Keys mode (fallback): matches our key against the slot's assigned bandersnatch key.
   * Tickets mode: O(1) lookup against the per-epoch authorship cache (built eagerly at
   * startup and on every epoch transition, so we never fall back to on-the-fly VRF).
   */
  function getSealData(
    sealingKeySeries: SafroleSealingKeys,
    keys: ValidatorKeys[],
    timeSlot: TimeSlot,
    entropy: EntropyHash,
  ): SealData | null {
```
