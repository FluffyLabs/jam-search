---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L303-L329
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 8
chunk_total: 9
content_sha: 119280dbf91a607be3016d80afe7997dbcef6816494b0577e253ca0ea792937c
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 303–329)

```typescript
      const genResult = await bandersnatchVrf.generateTickets(
        await bandersnatchWasm,
        ringKeys,
        [proverIndex],
        [secrets[proverIndex]],
        entropy,
        2,
      );

      assert.ok(genResult.isOk);

      const commitment = await bandersnatchVrf.getRingCommitment(await bandersnatchWasm, ringKeys);
      assert.ok(commitment.isOk);
      assert.strictEqual(genResult.ok.length, 1);

      const verifyResult = await bandersnatchVrf.verifyTickets(
        await bandersnatchWasm,
        ringKeys.length,
        commitment.ok,
        genResult.ok[0],
        entropy,
      );

      assert.ok(verifyResult.isValid, "Generated tickets should pass verification");
    });
  });
});
```
