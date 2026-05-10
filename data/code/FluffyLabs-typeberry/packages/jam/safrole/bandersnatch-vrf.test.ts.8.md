---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L317-L335
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 8
chunk_total: 9
content_sha: 3c959665681368962fde5213446149e1c725e441281213e25942b87ff1de0e29
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 317–335)

```typescript

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
