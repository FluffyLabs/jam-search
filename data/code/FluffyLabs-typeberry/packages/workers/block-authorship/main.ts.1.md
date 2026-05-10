---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L107-L213
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: fb652a72f7103d40ba8f85ede8eac764e2781f4fea66def959295da5d00d7aa6
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 107–213)

```typescript
      logEpochBlockCreation(tryAsEpoch(Math.floor(startTimeSlot / chainSpec.epochLength)), initialKeys.ok);
    }
  }

  function getTime() {
    const currentTime = process.hrtime.bigint() / 1_000_000n;
    const timeFromStart = currentTime - startTime;
    const slotDurationMs = BigInt(chainSpec.slotDuration * 1000);
    return tryAsU64(BigInt(startTimeSlot) * slotDurationMs + timeFromStart + slotDurationMs);
  }

  function getKeyForCurrentSlot(sealingKeySeries: SafroleSealingKeys, keys: ValidatorKeys[], timeSlot: TimeSlot) {
    if (sealingKeySeries.kind === SafroleSealingKeysKind.Keys) {
      const indexForCurrentSlot = timeSlot % sealingKeySeries.keys.length;
      const sealingKey = sealingKeySeries.keys[indexForCurrentSlot];
      return keys.find((x) => x.bandersnatchPublic.isEqualTo(sealingKey)) ?? null;
    }

    throw new Error("Tickets mode is not supported yet");
  }

  function getValidatorIndex(key: ValidatorKeys, currentValidatorData: PerValidator<ValidatorData>) {
    const index = currentValidatorData.findIndex((data) => data.bandersnatch.isEqualTo(key.bandersnatchPublic));
    if (index < 0) {
      return null;
    }
    return tryAsValidatorIndex(index);
  }

  function getSealPayload(
    sealingKeySeries: SafroleSealingKeys,
    entropy: EntropyHash,
    attempt?: TicketAttempt,
  ): BlockSealInput {
    if (sealingKeySeries.kind === SafroleSealingKeysKind.Keys) {
      return asOpaqueType(BytesBlob.blobFromParts(JAM_FALLBACK_SEAL, entropy.raw));
    }

    if (sealingKeySeries.kind === SafroleSealingKeysKind.Tickets) {
      return asOpaqueType(BytesBlob.blobFromParts(JAM_TICKET_SEAL, entropy.raw, new Uint8Array([attempt ?? 0])));
    }

    assertNever(sealingKeySeries);
  }

  function isEpochChanged(lastTimeslot: TimeSlot, currentTimeslot: TimeSlot): boolean {
    const lastEpoch = Math.floor(lastTimeslot / chainSpec.epochLength);
    const currentEpoch = Math.floor(currentTimeslot / chainSpec.epochLength);
    return currentEpoch > lastEpoch;
  }

  function logEpochBlockCreation(epoch: Epoch, sealingKeySeries: SafroleSealingKeys) {
    let isCreating = false;
    const epochStart = epoch * chainSpec.epochLength;
    const epochEnd = epochStart + chainSpec.epochLength;
    for (let slot = epochStart; slot < epochEnd; slot++) {
      const key = getKeyForCurrentSlot(sealingKeySeries, keys, tryAsTimeSlot(slot));
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

  const isFastForward = config.workerParams.isFastForward;
  let lastGeneratedSlot = startTimeSlot;
  let ticketsGeneratedForEpoch = -1;

  while (!isFinished) {
    const hash = blocks.getBestHeaderHash();
    const state = states.getState(hash);
    const currentValidatorData = state?.currentValidatorData;

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

```
