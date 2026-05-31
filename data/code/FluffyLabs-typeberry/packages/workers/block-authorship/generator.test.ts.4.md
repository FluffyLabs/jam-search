---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/generator.test.ts#L413-L519
title: packages/workers/block-authorship/generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 498ed45bee6dc12f6e82eabe601ee299a647dd46dfe85ff26d728bc323ad39da
language: typescript
---
`packages/workers/block-authorship/generator.test.ts` (lines 413–519)

```typescript
        { ticket: ticketB, id: duplicateId }, // same ID — should be deduplicated
      ]);

      const tickets = block.extrinsic.tickets as unknown as SignedTicket[];
      deepEqual(tickets.length, 1);
      // First occurrence is kept after sort (both have same ID, ticketA comes first)
      deepEqual(tickets[0].signature, sig1.asOpaque());
    });

    it("should include at most maxTicketsPerExtrinsic tickets", async () => {
      // tinyChainSpec.maxTicketsPerExtrinsic = 3
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

      // Create 4 tickets — only 3 should be included (lowest IDs win)
      const makeTicket = (sigByte: number, idByte: number) => {
        const sig = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
        sig.raw[0] = sigByte;
        return {
          ticket: SignedTicket.create({ attempt: tryAsTicketAttempt(0), signature: sig.asOpaque() }),
          id: Bytes.fill(HASH_SIZE, idByte).asOpaque<EntropyHash>(),
          sig: sig.asOpaque(),
        };
      };

      const t1 = makeTicket(1, 0x01); // lowest ID
      const t2 = makeTicket(2, 0x02);
      const t3 = makeTicket(3, 0x03);
      const t4 = makeTicket(4, 0x04); // highest ID — should be excluded

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(1);

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot, [
        { ticket: t4.ticket, id: t4.id }, // pass out-of-order to verify sorting
        { ticket: t2.ticket, id: t2.id },
        { ticket: t3.ticket, id: t3.id },
        { ticket: t1.ticket, id: t1.id },
      ]);

      const tickets = block.extrinsic.tickets as unknown as SignedTicket[];
      deepEqual(tickets.length, 3); // maxTicketsPerExtrinsic = 3
      // Should include the 3 lowest IDs, sorted ascending
      deepEqual(tickets[0].signature, t1.sig);
      deepEqual(tickets[1].signature, t2.sig);
      deepEqual(tickets[2].signature, t3.sig);
    });

    it("should create block with epoch marker at epoch boundary", async () => {
      // tinyChainSpec.epochLength = 12, so:
      // - timeslot 11 is last slot of epoch 0
      // - timeslot 12 is first slot of epoch 1
      const lastSlotOfEpoch0 = tinyChainSpec.epochLength - 1;
      const firstSlotOfEpoch1 = tinyChainSpec.epochLength;

      const state = createMockState(lastSlotOfEpoch0);
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

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(firstSlotOfEpoch1);

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot);

      const expectedEpochMarker = EpochMarker.create({
        entropy: MOCK_ENTROPY_0,
        ticketsEntropy: MOCK_ENTROPY_1,
        validators: asKnownSize(
          validatorDataArray.map((v) =>
            ValidatorKeys.create({
              bandersnatch: v.bandersnatch,
              ed25519: v.ed25519,
            }),
          ),
        ),
      });

      const expectedBlock = createExpectedBlock({
        timeSlot,
        validatorIndex,
        extrinsicHash: block.header.extrinsicHash,
        epochMarker: expectedEpochMarker,
      });

      deepEqual(block, expectedBlock);
    });
  });
});
```
