---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.ts#L223-L337
title: packages/jam/safrole/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 6
content_sha: dd38ff92986e4ffec4bb536e918c1850165d91b0783724b241c037c069fa8ce4
language: typescript
---
`packages/jam/safrole/safrole.ts` (lines 223–337)

```typescript
          return ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            ed25519: Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
            metadata: validator.metadata,
          });
        }

        return validator;
      }),
    );

    const { nextValidatorData, currentValidatorData } = this.state;
    const epochRootResult = await bandersnatchVrf.getRingCommitment(
      await this.bandersnatch,
      newNextValidators.map((x) => x.bandersnatch),
    );

    if (epochRootResult.isOk) {
      return Result.ok({
        nextValidatorData: newNextValidators,
        currentValidatorData: nextValidatorData,
        previousValidatorData: currentValidatorData,
        epochRoot: epochRootResult.ok,
      });
    }

    return Result.error(SafroleErrorCode.IncorrectData, () => "Safrole: failed to get epoch root for validator keys");
  }

  /**
   * Ticket sequencer that is used in standard mode
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0ea7020ea702
   */
  private outsideInSequencer(tickets: readonly Ticket[]) {
    const ticketsLength = tickets.length;
    const reorderedTickets = new Array<Ticket>(ticketsLength);

    const middle = Math.floor(ticketsLength / 2);
    for (let i = 0; i < middle; i += 1) {
      reorderedTickets[2 * i] = tickets[i];
      reorderedTickets[2 * i + 1] = tickets[ticketsLength - i - 1];
    }

    // handle potential edge case for odd number of elements
    //
    // eg. ticketsLength = 7, middle = floor(7/2) = 3;
    // 2 * middle = 6, which is less than 7
    // sets reorderedTickets[2 * middle = 6], with tickets[middle = 3]
    if (2 * middle < ticketsLength) {
      reorderedTickets[2 * middle] = tickets[middle];
    }

    return TicketsMarker.create({
      tickets: tryAsPerEpochBlock(reorderedTickets, this.chainSpec),
    });
  }

  /**
   * Ticket sequencer that is used in fallback mode
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0ea7020ea702
   */
  private fallbackKeySequencer(entropy: EntropyHash, newValidators: readonly ValidatorData[]) {
    const epochLength = this.chainSpec.epochLength;
    const result: BandersnatchKey[] = [];
    const validatorsCount = newValidators.length;
    for (let i = tryAsU32(0); i < epochLength; i++) {
      const iAsBytes = u32AsLeBytes(i);
      const bytes = this.blake2b.hashBlobs([entropy.raw, iAsBytes]).raw;
      const decoder = Decoder.fromBlob(bytes);
      const validatorIndex = decoder.u32() % validatorsCount;
      result.push(newValidators[validatorIndex].bandersnatch);
    }

    return tryAsPerEpochBlock(result, this.chainSpec);
  }

  /**
   * Returns a new slot sealer series that can consist of tickets or keys.
   * In might return 1 of 3 results depends on circumstances:
   * 1. reordered tickets accumulator in case of a new epoch
   * 2. previous state in case of the same epoch
   * 3. fallback keys sequence otherwise
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0ea2020ea202
   */
  private getSlotKeySequence(
    timeslot: TimeSlot,
    newValidators: readonly ValidatorData[],
    newEntropy: EntropyHash,
  ): SafroleSealingKeys {
    const m = this.getSlotPhaseIndex(this.state.timeslot);
    if (
      this.isNextEpoch(timeslot) &&
      m >= this.chainSpec.contestLength &&
      this.state.ticketsAccumulator.length === this.chainSpec.epochLength
    ) {
      return SafroleSealingKeysData.tickets(this.outsideInSequencer(this.state.ticketsAccumulator).tickets);
    }

    if (this.isSameEpoch(timeslot)) {
      return this.state.sealingKeySeries;
    }

    // TODO [MaSi]: the result of fallback sequencer should be cached
    return SafroleSealingKeysData.keys(this.fallbackKeySequencer(newEntropy, newValidators));
  }

  /**
   * Returns epoch markers if the epoch is changed and null otherwise
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0e6e030e6e03
   */
```
