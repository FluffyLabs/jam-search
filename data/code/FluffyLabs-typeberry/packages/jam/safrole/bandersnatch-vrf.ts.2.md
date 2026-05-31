---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.ts#L224-L257
title: packages/jam/safrole/bandersnatch-vrf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: bc6c98989e8e8d63a1b2531c44f8783af472ee6c24c3a435a52fdd50ab3551a1
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.ts` (lines 224–257)

```typescript
  const ringKeysData = BytesBlob.blobFromParts(ringKeys.map((k) => k.raw)).raw;

  const result = await bandersnatch.batchGenerateRingVrf(
    ringKeysData,
    proverKeyIndex,
    key.raw,
    inputsData,
    vrfInputDataLen,
  );

  const tickets: SignedTicket[] = [];
  for (let attempt = 0; attempt < ticketsPerValidator; attempt++) {
    const offset = attempt * GENERATE_RESULT_ENTRY_LENGTH;
    const resultByte = result[offset];

    if (resultByte === ResultValues.Error) {
      return Result.error(null, () => `Ring VRF proof generation failed for attempt ${attempt}`);
    }

    const signature = Bytes.fromBlob(
      new Uint8Array(result.subarray(offset + 1, offset + GENERATE_RESULT_ENTRY_LENGTH)),
      BANDERSNATCH_PROOF_BYTES,
    ).asOpaque();

    tickets.push(
      SignedTicket.create({
        attempt: tryAsTicketAttempt(attempt),
        signature,
      }),
    );
  }

  return Result.ok(tickets);
}
```
