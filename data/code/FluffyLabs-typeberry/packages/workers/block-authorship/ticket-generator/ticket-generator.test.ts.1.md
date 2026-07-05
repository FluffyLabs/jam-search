---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator/ticket-generator.test.ts#L110-L161
title: packages/workers/block-authorship/ticket-generator/ticket-generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e935eeba9204851ddc4a1d76670555cf89084855a09c98d3f362222de3f19c0d
language: typescript
---
`packages/workers/block-authorship/ticket-generator/ticket-generator.test.ts` (lines 110–161)

```typescript
    it("should skip validators not in the ring and return tickets for valid ones", async () => {
      const ticketsPerValidator = 2;
      const ringKeys = createMockRingKeys(3);
      const correctValidatorKeys = createMockValidatorKeys(2);
      const incorrectValidatorKeys: ValidatorKey[] = [
        {
          secret: Bytes.fill(SEED_SIZE, 99).asOpaque(),
          public: Bytes.fill(BANDERSNATCH_KEY_BYTES, 99).asOpaque(),
        },
      ];
      const validatorKeys = [...correctValidatorKeys, ...incorrectValidatorKeys];

      const result = await generateTickets(
        MOCK_BANDERSNATCH,
        ringKeys,
        validatorKeys,
        MOCK_ENTROPY,
        ticketsPerValidator,
      );

      assert.ok(result.isOk);
      // Only the 2 valid validators should produce tickets
      assert.strictEqual(result.ok.length, 4);
    });

    it("should error when all validators fail", async () => {
      const ticketsPerValidator = 2;
      const ringKeys = createMockRingKeys(3);
      const invalidValidatorKeys: ValidatorKey[] = [
        {
          secret: Bytes.fill(SEED_SIZE, 99).asOpaque(),
          public: Bytes.fill(BANDERSNATCH_KEY_BYTES, 99).asOpaque(),
        },
        {
          secret: Bytes.fill(SEED_SIZE, 98).asOpaque(),
          public: Bytes.fill(BANDERSNATCH_KEY_BYTES, 98).asOpaque(),
        },
      ];

      const result = await generateTickets(
        MOCK_BANDERSNATCH,
        ringKeys,
        invalidValidatorKeys,
        MOCK_ENTROPY,
        ticketsPerValidator,
      );

      assert.ok(result.isError);
      assert.strictEqual(result.error, TicketGeneratorError.TicketGenerationFailed);
    });
  });
});
```
