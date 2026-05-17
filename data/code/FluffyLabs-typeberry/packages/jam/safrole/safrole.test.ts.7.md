---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.test.ts#L705-L828
title: packages/jam/safrole/safrole.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 7
chunk_total: 9
content_sha: 0c6c0de7459e8aa8231ae5a0924dd2e99a7cff3f9b9d16ba61bbad7461e4f2ae
language: typescript
---
`packages/jam/safrole/safrole.test.ts` (lines 705–828)

```typescript
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
      ticketsAccumulator: asKnownSize([
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 1),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 2),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 3),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 4),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 5),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 6),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 7),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 8),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 9),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 10),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 11),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 12),
        }),
      ]),
      sealingKeySeries: fakeSealingKeys,
      epochRoot: Bytes.zero(BANDERSNATCH_RING_ROOT_BYTES).asOpaque(),
    };
    const safrole = new Safrole(tinyChainSpec, blake2b, state, bwasm);
    const timeslot = tryAsTimeSlot(10);
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
      assert.deepEqual(result.error, SafroleErrorCode.TicketsMarkerInvalid);
    }
  });

  it("should return tickets mark unexpected error when tickets marker is present but not wanted", async () => {
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
    const extrinsic: TicketsExtrinsic = asKnownSize([]);
    const tickets = tryAsPerEpochBlock(
      [
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 1),
        }),
        Ticket.create({
          attempt: tryAsTicketAttempt(0),
          id: Bytes.fill(HASH_SIZE, 2),
        }),
        Ticket.create({
```
