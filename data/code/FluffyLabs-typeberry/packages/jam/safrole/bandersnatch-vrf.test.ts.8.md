---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L311-L335
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 8
chunk_total: 9
content_sha: 13fe554dc9ad99fe801eeb4eafc1ca696ca3d556cd738054300c44fffe433f95
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 311–335)

```typescript
        secrets[proverIndex],
        entropy,
        2,
      );

      assert.ok(genResult.isOk);

      const commitment = await bandersnatchVrf.getRingCommitment(await bandersnatchWasm, ringKeys);
      assert.ok(commitment.isOk);

      const verifyResult = await bandersnatchVrf.verifyTickets(
        await bandersnatchWasm,
        ringKeys.length,
        commitment.ok,
        genResult.ok,
        entropy,
      );

      assert.ok(
        verifyResult.every((r) => r.isValid),
        "Generated tickets should pass verification",
      );
    });
  });
});
```
