---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.test.ts#L473-L605
title: packages/jam/safrole/safrole.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 5
chunk_total: 9
content_sha: ed933360adbc66b90a9e37bc310a44602cc4c3fcd9f59582a17fcd30d8f37b84
language: typescript
---
`packages/jam/safrole/safrole.test.ts` (lines 473–605)

```typescript
        attempt: tryAsTicketAttempt(0),
        id: Bytes.fill(HASH_SIZE, 6),
      }),
      Ticket.create({
        attempt: tryAsTicketAttempt(0),
        id: Bytes.fill(HASH_SIZE, 7),
      }),
    ]);

    const input: Input = {
      slot: timeslot,
      entropy,
      extrinsic,
      punishSet,
      epochMarker: null,
      ticketsMarker: reencodeAsView(TicketsMarker.Codec, TicketsMarker.create({ tickets }), tinyChainSpec),
    };

    const result = await safrole.transition(input);
    assert.ok(result.isOk, "Expected transition to pass successfully");

    deepEqual(
      result.ok.ticketsMark,
      TicketsMarker.create({
        tickets: asKnownSize([
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 1),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 12),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 2),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 11),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 3),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 10),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 4),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 9),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 5),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 8),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 6),
          }),
          Ticket.create({
            attempt: tryAsTicketAttempt(0),
            id: Bytes.fill(HASH_SIZE, 7),
          }),
        ]),
      }),
    );
  });

  it("should return correct result for empty data", async () => {
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

    deepEqual(
      result,
      Result.ok({
        // we are ignoring that result anyway, so safe to cast.
        stateUpdate: {} as SafroleStateUpdate,
        epochMark: null,
        ticketsMark: null,
      }),
      { ignore: ["ok.stateUpdate"] },
    );
  });

  it("should return epoch marker missing error when epoch changes but epochMarker is null", async () => {
```
