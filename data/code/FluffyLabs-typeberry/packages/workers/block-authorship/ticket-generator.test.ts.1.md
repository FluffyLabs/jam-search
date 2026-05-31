---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator.test.ts#L110-L157
title: packages/workers/block-authorship/ticket-generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 134edbaa723302d46a0c77482bc06ffb6c1357ea46e56ddf56c0ed350b649137
language: typescript
---
`packages/workers/block-authorship/ticket-generator.test.ts` (lines 110–157)

```typescript
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
