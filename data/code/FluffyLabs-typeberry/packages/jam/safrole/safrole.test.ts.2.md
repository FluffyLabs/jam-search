---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.test.ts#L111-L237
title: packages/jam/safrole/safrole.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 9
content_sha: 430d8a943af9a2b87ae9274944f070ea9699314b343e894886b2ec9a721451da
language: typescript
---
`packages/jam/safrole/safrole.test.ts` (lines 111–237)

```typescript
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
      Promise.resolve({ isValid: false, tickets: [Bytes.zero(HASH_SIZE)] }),
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
      assert.deepEqual(result.error, SafroleErrorCode.BadTicketProof);
    }
  });

```
