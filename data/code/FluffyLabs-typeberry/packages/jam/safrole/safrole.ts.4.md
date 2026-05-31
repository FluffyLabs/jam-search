---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.ts#L439-L541
title: packages/jam/safrole/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 4
chunk_total: 6
content_sha: 51f6552c9168079cc9a73640df58f2e4f3febffd445200464517c22068bd49cd
language: typescript
---
`packages/jam/safrole/safrole.ts` (lines 439–541)

```typescript
     * Remove tickets if size of accumulator exceeds E (epoch length).
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/0f89010f8901
     */
    return Result.ok(mergedTickets.array.slice(0, this.chainSpec.epochLength));
  }

  private shouldIncludeTicketsMarker(timeslot: TimeSlot): boolean {
    const m = this.getSlotPhaseIndex(this.state.timeslot);
    const mPrime = this.getSlotPhaseIndex(timeslot);
    return (
      this.isSameEpoch(timeslot) &&
      m < this.chainSpec.contestLength &&
      this.chainSpec.contestLength <= mPrime &&
      this.state.ticketsAccumulator.length === this.chainSpec.epochLength
    );
  }

  /**
   * Returns winning-tickets markers if the block is the first after the end of the submission period
   * for tickets and if the ticket accumulator is saturated and null otherwise
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0ea0030ea003
   */
  private getTicketsMarker(timeslot: TimeSlot): TicketsMarker | null {
    if (this.shouldIncludeTicketsMarker(timeslot)) {
      return this.outsideInSequencer(this.state.ticketsAccumulator);
    }

    return null;
  }

  /**
   * Verify correctness of the ticket extrinsic length.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0f83000f8300
   */
  private isExtrinsicLengthValid(timeslot: TimeSlot, extrinsic: readonly SignedTicket[]) {
    const slotPhase = this.getSlotPhaseIndex(timeslot);

    if (slotPhase < this.chainSpec.contestLength) {
      return extrinsic.length <= this.chainSpec.maxTicketsPerExtrinsic;
    }

    return extrinsic.length === 0;
  }

  /**
   * Verify if attempt values are correct
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0f23000f2400
   */
  private areTicketAttemptsValid(tickets: readonly SignedTicket[]) {
    const ticketsLength = tickets.length;
    for (let i = 0; i < ticketsLength; i++) {
      if (tickets[i].attempt >= this.chainSpec.ticketsPerValidator) {
        return false;
      }
    }

    return true;
  }

  getSafroleSealState(timeslot: TimeSlot): SafroleSealState {
    const isFirstInNewEpoch = this.isEpochChanged(timeslot);
    const currentValidatorData = isFirstInNewEpoch ? this.state.nextValidatorData : this.state.currentValidatorData;
    const newEntropy = this.state.entropy[isFirstInNewEpoch ? 1 : 2];
    const currentEntropy = this.state.entropy[isFirstInNewEpoch ? 2 : 3];
    const sealingKeySeries = this.getSlotKeySequence(timeslot, currentValidatorData, newEntropy);

    return {
      currentValidatorData,
      currentEntropy,
      sealingKeySeries,
    };
  }

  async getSealingKeySeries(
    input: Omit<Input, "epochMarker" | "ticketsMarker" | "extrinsic">,
  ): Promise<Result<SafroleSealingKeys, typeof SafroleErrorCode.IncorrectData>> {
    const validatorKeysResult = await this.getValidatorKeys(input.slot, input.punishSet);
    if (validatorKeysResult.isError) {
      return Result.error(validatorKeysResult.error, validatorKeysResult.details);
    }
    const { currentValidatorData } = validatorKeysResult.ok;
    return Result.ok(this.getSlotKeySequence(input.slot, currentValidatorData, input.entropy));
  }

  async blockAuthorshipTransition(
    input: Omit<Input, "epochMarker" | "ticketsMarker">,
  ): Promise<Result<Omit<OkResult, "stateUpdate"> & { sealingKeySeries: SafroleSealingKeys }, SafroleErrorCode>> {
    const validatorKeysResult = await this.getValidatorKeys(input.slot, input.punishSet);

    if (validatorKeysResult.isError) {
      return Result.error(validatorKeysResult.error, validatorKeysResult.details);
    }
    const { currentValidatorData } = validatorKeysResult.ok;
    const entropy = this.getEntropy(input.slot, input.entropy);
    const sealingKeySeries = this.getSlotKeySequence(input.slot, currentValidatorData, entropy[2]);

    const epochMark = this.getEpochMark(input.slot, validatorKeysResult.ok.nextValidatorData);
    const ticketsMark = this.getTicketsMarker(input.slot);
    return Result.ok({ epochMark, ticketsMark, sealingKeySeries });
```
