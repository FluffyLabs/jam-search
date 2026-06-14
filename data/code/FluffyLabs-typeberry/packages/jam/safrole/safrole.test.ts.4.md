---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.test.ts#L350-L481
title: packages/jam/safrole/safrole.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 4
chunk_total: 9
content_sha: a5813663eec8f991a7b37768bc89e401d47e55ab43f056b54959020bff10ad27
language: typescript
---
`packages/jam/safrole/safrole.test.ts` (lines 350–481)

```typescript
      assert.deepEqual(result.error, SafroleErrorCode.BadTicketOrder);
    }
  });

  it("should return correctly sequenced sealingKeySeries", async () => {
    const punishSet = SortedSet.fromArray<Ed25519Key>(hashComparator);
    const state: SafroleState = {
      // end of epoch
      timeslot: tryAsTimeSlot(9),
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
    // new epoch; return reordered tickets accumulator
    const timeslot = tryAsTimeSlot(10);
    const entropy: EntropyHash = Bytes.zero(HASH_SIZE).asOpaque();
    const extrinsic: TicketsExtrinsic = asKnownSize([]);

    const tickets = asKnownSize([
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
    ]);

```
