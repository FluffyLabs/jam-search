---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.ts#L330-L445
title: packages/jam/safrole/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 6
content_sha: db2a69fe400c230c71782a647ea058d09c4a7c3778b318dcbbe29bb91533a0d8
language: typescript
---
`packages/jam/safrole/safrole.ts` (lines 330–445)

```typescript
    return SafroleSealingKeysData.keys(this.fallbackKeySequencer(newEntropy, newValidators));
  }

  /**
   * Returns epoch markers if the epoch is changed and null otherwise
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0e6e030e6e03
   */
  private getEpochMark(timeslot: TimeSlot, nextValidators: PerValidator<ValidatorData>): EpochMarker | null {
    if (!this.isEpochChanged(timeslot)) {
      return null;
    }

    const entropy = this.state.entropy;
    return EpochMarker.create({
      entropy: entropy[0],
      ticketsEntropy: entropy[1],
      validators: asKnownSize(nextValidators.map((validator) => ValidatorKeys.create(validator))),
    });
  }

  /**
   * Verify if tickets array has no duplicates and is sorted by id
   */
  private verifyTickets(
    tickets: Ticket[],
  ): Result<null, SafroleErrorCode.BadTicketOrder | SafroleErrorCode.DuplicateTicket> {
    const ticketsLength = tickets.length;

    for (let i = 1; i < ticketsLength; i++) {
      const order = tickets[i - 1].id.compare(tickets[i].id);
      if (order.isEqual()) {
        return Result.error(SafroleErrorCode.DuplicateTicket, () => `Safrole: duplicate ticket found at index ${i}`);
      }

      if (order.isGreater()) {
        return Result.error(SafroleErrorCode.BadTicketOrder, () => `Safrole: bad ticket order at index ${i}`);
      }
    }

    return Result.ok(null);
  }

  /**
   * Returns a new tickets accumulator.
   * If the epoch is not changed, it extends the accumulator with tickets from the extrinsic.
   * Otherwise, returns a new accumulator consisting only of tickets from the extrinsic.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0f03010f0301
   */
  private async getNewTicketAccumulator(
    timeslot: TimeSlot,
    extrinsic: readonly SignedTicket[],
    validators: readonly ValidatorData[],
    epochRoot: BandersnatchRingRoot,
    entropy: EntropyHash,
  ): Promise<Result<Ticket[], SafroleErrorCode>> {
    /**
     * Verify ticket proof of validity
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/0f59000f5900
     */
    // TODO [ToDr] Verify that ticket attempt is in correct range.
    const verificationResult =
      extrinsic.length === 0
        ? []
        : await bandersnatchVrf.verifyTickets(
            await this.bandersnatch,
            validators.length,
            epochRoot,
            extrinsic,
            entropy,
          );

    const tickets: Ticket[] = extrinsic.map((ticket, i) => ({
      id: verificationResult[i].entropyHash,
      attempt: ticket.attempt,
    }));

    if (!verificationResult.every((x) => x.isValid)) {
      return Result.error(SafroleErrorCode.BadTicketProof, () => "Safrole: invalid ticket proof in extrinsic");
    }

    /**
     * Verify if tickets are sorted and unique
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/0fe4000fe400
     */
    const ticketsVerifcationResult = this.verifyTickets(tickets);
    if (ticketsVerifcationResult.isError) {
      return Result.error(ticketsVerifcationResult.error, ticketsVerifcationResult.details);
    }

    if (this.isEpochChanged(timeslot)) {
      return Result.ok(tickets);
    }

    const ticketsFromState = SortedSet.fromSortedArray(ticketComparator, this.state.ticketsAccumulator);
    const ticketsFromExtrinsic = SortedSet.fromSortedArray(ticketComparator, tickets);
    const mergedTickets = SortedSet.fromTwoSortedCollections(ticketsFromState, ticketsFromExtrinsic);

    if (ticketsFromState.length + ticketsFromExtrinsic.length !== mergedTickets.length) {
      return Result.error(
        SafroleErrorCode.DuplicateTicket,
        () => "Safrole: duplicate ticket when merging state and extrinsic tickets",
      );
    }

    /**
     * Remove tickets if size of accumulator exceeds E (epoch length).
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/0f89010f8901
     */
    return Result.ok(mergedTickets.array.slice(0, this.chainSpec.epochLength));
  }

```
