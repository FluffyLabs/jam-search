---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.ts#L234-L274
title: packages/jam/safrole/bandersnatch-vrf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 2362af745dcfeeb3795866839026bdba0b74312af163bee38db6b4e66b88ae02
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.ts` (lines 234–274)

```typescript
  const vrfInputParts: Uint8Array[] = [];
  for (let attempt = 0; attempt < ticketsPerValidator; attempt++) {
    vrfInputParts.push(BytesBlob.blobFromParts([JAM_TICKET_SEAL, entropy.raw, Uint8Array.of(attempt)]).raw);
  }
  const attemptLength = 1;
  const vrfInputDataLen = JAM_TICKET_SEAL.length + entropy.length + attemptLength;
  const inputsData = BytesBlob.blobFromParts(vrfInputParts).raw;
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
