---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/block-generator.test.ts#L206-L316
title: packages/workers/block-authorship/block-generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 5
content_sha: 75143a5d0ab8f17b71689a650e39990a7090ced30df0416f111bd463753a9fd3
language: typescript
---
`packages/workers/block-authorship/block-generator.test.ts` (lines 206–316)

```typescript
    it("should create block for same-epoch slot", async () => {
      const state = createMockState(0);
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = BlockGenerator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(1);

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot);

      const expectedBlock = createExpectedBlock({
        timeSlot,
        validatorIndex,
        extrinsicHash: block.header.extrinsicHash,
      });

      deepEqual(block, expectedBlock);
    });

    it("should include sorted tickets during contest period", async () => {
      // tinyChainSpec: contestLength = 10, so slot 1 is in contest period (1 < 10)
      const state = createMockState(0);
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = BlockGenerator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      // Create two tickets with different signatures
      const sig1 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      sig1.raw[0] = 1;
      const sig2 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      sig2.raw[0] = 2;

      const ticket1 = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig1.asOpaque(),
      });
      const ticket2 = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig2.asOpaque(),
      });

      // ticket2 gets smaller ID (0x01...) and ticket1 gets larger ID (0x02...)
      // so the sorted order should be [ticket2, ticket1]
      const id1 = Bytes.fill(HASH_SIZE, 0x02).asOpaque<EntropyHash>();
      const id2 = Bytes.fill(HASH_SIZE, 0x01).asOpaque<EntropyHash>();

      const validatorIndex = tryAsValidatorIndex(0);
      // Slot 1 is in contest period (1 < contestLength=10)
      const timeSlot = tryAsTimeSlot(1);

      // IDs are now pre-computed before passing to nextBlock
      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot, [
        { ticket: ticket1, id: id1 },
        { ticket: ticket2, id: id2 },
      ]);

      // Tickets should be sorted by ID ascending: ticket2 (id=0x01) before ticket1 (id=0x02)
      const tickets = block.extrinsic.tickets as unknown as SignedTicket[];
      deepEqual(tickets.length, 2);
      deepEqual(tickets[0].signature, sig2.asOpaque());
      deepEqual(tickets[1].signature, sig1.asOpaque());
    });

    it("should exclude tickets outside contest period", async () => {
      // tinyChainSpec: contestLength = 10, epochLength = 12
      // Slot 10 is outside contest period (10 >= 10)
      const state = createMockState(9);
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = BlockGenerator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      const sig1 = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
      const ticket1 = SignedTicket.create({
        attempt: tryAsTicketAttempt(0),
        signature: sig1.asOpaque(),
      });

      const validatorIndex = tryAsValidatorIndex(0);
      // Slot 10 is NOT in contest period (10 >= contestLength=10)
      const timeSlot = tryAsTimeSlot(10);

      const mockId = Bytes.fill(HASH_SIZE, 0x01).asOpaque<EntropyHash>();
      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot, [
        { ticket: ticket1, id: mockId },
      ]);

```
