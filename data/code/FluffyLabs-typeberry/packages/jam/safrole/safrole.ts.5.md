---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.ts#L539-L652
title: packages/jam/safrole/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 5
chunk_total: 6
content_sha: 3c4890340f89bb1c6c0f8a177153f2c425f56119b8cb48f931bce9938ecedb29
language: typescript
---
`packages/jam/safrole/safrole.ts` (lines 539–652)

```typescript
    const epochMark = this.getEpochMark(input.slot, validatorKeysResult.ok.nextValidatorData);
    const ticketsMark = this.getTicketsMarker(input.slot);
    return Result.ok({ epochMark, ticketsMark, sealingKeySeries });
  }

  async transition(input: Input): Promise<Result<OkResult, SafroleErrorCode>> {
    if (this.state.timeslot >= input.slot) {
      return Result.error(
        SafroleErrorCode.BadSlot,
        () => `Safrole: bad slot, state timeslot ${this.state.timeslot} >= input slot ${input.slot}`,
      );
    }

    if (!this.isExtrinsicLengthValid(input.slot, input.extrinsic)) {
      return Result.error(
        SafroleErrorCode.UnexpectedTicket,
        () => `Safrole: unexpected ticket, invalid extrinsic length ${input.extrinsic.length}`,
      );
    }

    if (!this.areTicketAttemptsValid(input.extrinsic)) {
      return Result.error(SafroleErrorCode.BadTicketAttempt, () => "Safrole: bad ticket attempt value in extrinsic");
    }

    const validatorKeysResult = await this.getValidatorKeys(input.slot, input.punishSet);

    if (validatorKeysResult.isError) {
      return Result.error(validatorKeysResult.error, validatorKeysResult.details);
    }

    const { nextValidatorData, currentValidatorData, previousValidatorData, epochRoot } = validatorKeysResult.ok;
    const entropy = this.getEntropy(input.slot, input.entropy);
    const sealingKeySeries = this.getSlotKeySequence(input.slot, currentValidatorData, entropy[2]);
    const newTicketsAccumulatorResult = await this.getNewTicketAccumulator(
      input.slot,
      input.extrinsic,
      this.state.nextValidatorData,
      epochRoot,
      entropy[2],
    );

    if (newTicketsAccumulatorResult.isError) {
      return Result.error(newTicketsAccumulatorResult.error, newTicketsAccumulatorResult.details);
    }

    const stateUpdate = {
      nextValidatorData,
      currentValidatorData,
      previousValidatorData,
      epochRoot,
      timeslot: input.slot,
      entropy,
      sealingKeySeries,
      ticketsAccumulator: asKnownSize(newTicketsAccumulatorResult.ok),
    };

    const epochMarker = this.getEpochMark(input.slot, nextValidatorData);
    const epochMarkerRes = compareWithEncoding(
      this.chainSpec,
      SafroleErrorCode.EpochMarkerInvalid,
      epochMarker,
      input.epochMarker,
      EpochMarker.Codec,
    );

    if (epochMarkerRes.isError) {
      return epochMarkerRes;
    }

    const ticketsMarker = this.getTicketsMarker(input.slot);
    const ticketsMarkerRes = compareWithEncoding(
      this.chainSpec,
      SafroleErrorCode.TicketsMarkerInvalid,
      ticketsMarker,
      input.ticketsMarker,
      TicketsMarker.Codec,
    );
    if (ticketsMarkerRes.isError) {
      return ticketsMarkerRes;
    }

    const result = {
      epochMark: epochMarker,
      ticketsMark: ticketsMarker,
      stateUpdate,
    };

    return Result.ok(result);
  }
}

function compareWithEncoding<T, D extends DescriptorRecord<T>>(
  chainSpec: ChainSpec,
  error: SafroleErrorCode,
  actual: T | null,
  expected: ViewOf<T, D> | null,
  codec: Codec<T>,
): Result<OK, SafroleErrorCode> {
  if (actual === null || expected === null) {
    // if one of them is `null`, both need to be.
    if (actual !== expected) {
      return Result.error(error, () => `${SafroleErrorCode[error]} Expected: ${expected}, got: ${actual}`);
    }
    return Result.ok(OK);
  }

  // compare the literal encoding.
  const encoded = Encoder.encodeObject(codec, actual, chainSpec);
  if (!encoded.isEqualTo(expected.encoded())) {
    return Result.error(error, () => `${SafroleErrorCode[error]} Expected: ${expected.encoded()}, got: ${encoded}`);
  }

  return Result.ok(OK);
}
```
