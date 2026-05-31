---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/generator.test.ts#L312-L417
title: packages/workers/block-authorship/generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 7860f9a1a10bd8d134456520e48e93dd70e942269cc67aa6b237792a0bb3c676
language: typescript
---
`packages/workers/block-authorship/generator.test.ts` (lines 312–417)

```typescript
      const mockId = Bytes.fill(HASH_SIZE, 0x01).asOpaque<EntropyHash>();
      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot, [
        { ticket: ticket1, id: mockId },
      ]);

      // No tickets should be included outside contest period
      const tickets = block.extrinsic.tickets as unknown as SignedTicket[];
      deepEqual(tickets.length, 0);
    });

    it("should filter out tickets already in ticketsAccumulator", async () => {
      // Build a state that already has ticket with id=0x01 in its accumulator
      const accumulatedId = Bytes.fill(HASH_SIZE, 0x01).asOpaque<EntropyHash>();
      const accumulatedTicket = Ticket.create({
        id: accumulatedId,
        attempt: tryAsTicketAttempt(0),
      });

      const state = {
        ...createMockState(0),
        ticketsAccumulator: asKnownSize([accumulatedTicket]),
      };
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = Generator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      const sig1 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      sig1.raw[0] = 1;
      const sig2 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      sig2.raw[0] = 2;

      const ticketAlreadyAccumulated = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig1.asOpaque(),
      });
      const ticketNew = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig2.asOpaque(),
      });

      // id=0x01 is already in accumulator, id=0x02 is new
      const idAccumulated = Bytes.fill(HASH_SIZE, 0x01).asOpaque<EntropyHash>();
      const idNew = Bytes.fill(HASH_SIZE, 0x02).asOpaque<EntropyHash>();

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(1); // inside contest period

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot, [
        { ticket: ticketAlreadyAccumulated, id: idAccumulated },
        { ticket: ticketNew, id: idNew },
      ]);

      // Only the new ticket (not in accumulator) should be included
      const tickets = block.extrinsic.tickets as unknown as SignedTicket[];
      deepEqual(tickets.length, 1);
      deepEqual(tickets[0].signature, sig2.asOpaque());
    });

    it("should deduplicate tickets by ID", async () => {
      const state = createMockState(0);
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = Generator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      const sig1 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      sig1.raw[0] = 1;
      const sig2 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      sig2.raw[0] = 2;

      // Two different SignedTicket objects but with the same ID (e.g. duplicate from reorg)
      const ticketA = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig1.asOpaque(),
      });
      const ticketB = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig2.asOpaque(),
      });
      const duplicateId = Bytes.fill(HASH_SIZE, 0x05).asOpaque<EntropyHash>();

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(1);

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot, [
        { ticket: ticketA, id: duplicateId },
        { ticket: ticketB, id: duplicateId }, // same ID — should be deduplicated
      ]);

      const tickets = block.extrinsic.tickets as unknown as SignedTicket[];
      deepEqual(tickets.length, 1);
```
