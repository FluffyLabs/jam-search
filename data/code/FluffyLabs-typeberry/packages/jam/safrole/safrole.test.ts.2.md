---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.test.ts#L110-L233
title: packages/jam/safrole/safrole.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 9
content_sha: dfb0343f2cd067ba79dae6c9b4adc758898741069ade37220297cb7b9a56f6dc
language: typescript
---
`packages/jam/safrole/safrole.test.ts` (lines 110–233)

```typescript
    const safrole = new Safrole(tinyChainSpec, blake2b, state, bwasm);
    const timeslot = tryAsTimeSlot(0);
    const entropy: EntropyHash = Bytes.zero(HASH_SIZE).asOpaque();
    const extrinsic: TicketsExtrinsic = asKnownSize([]);
    const input = {
      slot: timeslot,
      entropy,
      extrinsic,
      punishSet,
      epochMarker: null,
      ticketsMarker: null,
    };

    const result = await safrole.transition(input);

    assert.deepEqual(result.isError, true);
    if (result.isError) {
      assert.deepEqual(result.error, SafroleErrorCode.BadSlot);
    }
  });

  it("should return unexpected ticket because of incorrect length of extrinsic", async () => {
    const state = { timeslot: 1 } as SafroleState;
    const punishSet = SortedSet.fromArray<Ed25519Key>(hashComparator);
    const safrole = new Safrole(tinyChainSpec, blake2b, state, bwasm);
    const timeslot = tryAsTimeSlot(2);
    const entropy: EntropyHash = Bytes.zero(HASH_SIZE).asOpaque();
    const extrinsic: SignedTicket[] = [];
    extrinsic.length = tinyChainSpec.epochLength + 1;
    const input = {
      slot: timeslot,
      entropy,
      extrinsic: asKnownSize(extrinsic),
      punishSet,
      epochMarker: null,
      ticketsMarker: null,
    };

    const result = await safrole.transition(input);

    assert.deepEqual(result.isError, true);
    if (result.isError) {
      assert.deepEqual(result.error, SafroleErrorCode.UnexpectedTicket);
    }
  });

  it("should return bad ticket attempt because of incorrect ticket attempt", async () => {
    const state = { timeslot: 1 } as SafroleState;
    const punishSet = SortedSet.fromArray<Ed25519Key>(hashComparator);
    const safrole = new Safrole(tinyChainSpec, blake2b, state, bwasm);
    const timeslot = tryAsTimeSlot(2);
    const entropy: EntropyHash = Bytes.zero(HASH_SIZE).asOpaque();

    const extrinsic: TicketsExtrinsic = asKnownSize([
      {
        attempt: tryAsTicketAttempt(tinyChainSpec.ticketsPerValidator + 2),
        signature: Bytes.zero(BANDERSNATCH_PROOF_BYTES).asOpaque(),
      },
    ]);

    const input = {
      slot: timeslot,
      entropy,
      extrinsic,
      punishSet,
      epochMarker: null,
      ticketsMarker: null,
    };

    const result = await safrole.transition(input);

    assert.deepEqual(result.isError, true);
    if (result.isError) {
      assert.deepEqual(result.error, SafroleErrorCode.BadTicketAttempt);
    }
  });

  it("should return bad ticket proof error", async () => {
    mock.method(bandersnatchVrf, "verifyTickets", () =>
      Promise.resolve([{ isValid: false, entropyHash: Bytes.zero(HASH_SIZE) }]),
    );
    const punishSet = SortedSet.fromArray<Ed25519Key>(hashComparator);
    const state: SafroleState = {
      timeslot: tryAsTimeSlot(1),
      entropy: FixedSizeArray.new(
        [
          Bytes.zero(HASH_SIZE).asOpaque(),
          Bytes.zero(HASH_SIZE).asOpaque(),
          Bytes.zero(HASH_SIZE).asOpaque(),
          Bytes.zero(HASH_SIZE).asOpaque(),
        ],
        4,
      ),
      previousValidatorData: validators,
      currentValidatorData: validators,
      designatedValidatorData: validators,
      nextValidatorData: validators,
      ticketsAccumulator: asKnownSize([]),
      sealingKeySeries: fakeSealingKeys,
      epochRoot: Bytes.zero(BANDERSNATCH_RING_ROOT_BYTES).asOpaque(),
    };
    const safrole = new Safrole(tinyChainSpec, blake2b, state, bwasm);
    const timeslot = tryAsTimeSlot(2);
    const entropy: EntropyHash = Bytes.zero(HASH_SIZE).asOpaque();
    const extrinsic: TicketsExtrinsic = asKnownSize([
      {
        attempt: tryAsTicketAttempt(0),
        signature: Bytes.zero(BANDERSNATCH_PROOF_BYTES).asOpaque(),
      },
    ]);

    const input = {
      slot: timeslot,
      entropy,
      extrinsic,
      punishSet,
      epochMarker: null,
      ticketsMarker: null,
    };

    const result = await safrole.transition(input);

    assert.deepEqual(result.isError, true);
    if (result.isError) {
```
