---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.ts#L234-L316
title: packages/jam/safrole/bandersnatch-vrf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 3
content_sha: 13667282789f8ecf185ba9d5cc37bb066a141a65c667d7bc2db0017c67be2757
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.ts` (lines 234–316)

```typescript
async function generateTickets(
  bandersnatch: BandernsatchWasm,
  ringKeys: BandersnatchKey[],
  proverKeyIndices: readonly number[],
  secrets: readonly BandersnatchSecretSeed[],
  entropy: EntropyHash,
  ticketsPerValidator: number,
): Promise<Result<SignedTicket[][], null>> {
  if (proverKeyIndices.length !== secrets.length) {
    return Result.error(null, () => "proverKeyIndices and secrets must have the same length");
  }
  if (proverKeyIndices.length === 0) {
    return Result.ok([]);
  }

  const { inputsData, vrfInputDataLen } = buildTicketVrfInputs(entropy, ticketsPerValidator);
  const ringKeysData = BytesBlob.blobFromParts(ringKeys.map((k) => k.raw)).raw;
  const secretSeedsData = BytesBlob.blobFromParts(secrets.map((s) => s.raw)).raw;

  const result = await bandersnatch.batchGenerateRingVrfForValidators(
    ringKeysData,
    Uint32Array.from(proverKeyIndices),
    secretSeedsData,
    SEED_SIZE,
    inputsData,
    vrfInputDataLen,
  );

  return parseTicketsBatchOutput(result, proverKeyIndices.length, ticketsPerValidator);
}

/**
 * Build the concatenated ring-VRF inputs for ticket generation: one
 * `JAM_TICKET_SEAL || entropy || attempt_byte` input per attempt.
 *
 * Exposed so the worker-pool path can build the same inputs to hand off to a
 * worker thread without re-deriving the layout.
 */
export function buildTicketVrfInputs(
  entropy: EntropyHash,
  ticketsPerValidator: number,
): { inputsData: Uint8Array; vrfInputDataLen: number } {
  const vrfInputParts: Uint8Array[] = [];
  for (let attempt = 0; attempt < ticketsPerValidator; attempt++) {
    vrfInputParts.push(BytesBlob.blobFromParts([JAM_TICKET_SEAL, entropy.raw, Uint8Array.of(attempt)]).raw);
  }
  return {
    inputsData: BytesBlob.blobFromParts(vrfInputParts).raw,
    vrfInputDataLen: JAM_TICKET_SEAL.length + entropy.length + 1,
  };
}

/**
 * Parse the raw output of `batchGenerateRingVrfForValidators` into per-validator
 * ticket lists. Records are ordered validator-major, then attempt-major; each
 * record is `status byte || signature`. A malformed batch yields a single error
 * byte. Exposed so the worker-pool path can parse a worker's raw result.
 */
export function parseTicketsBatchOutput(
  result: Uint8Array,
  numValidators: number,
  ticketsPerValidator: number,
): Result<SignedTicket[][], null> {
  const perValidator: SignedTicket[][] = [];
  let offset = 0;
  for (let v = 0; v < numValidators; v++) {
    const tickets: SignedTicket[] = [];
    for (let attempt = 0; attempt < ticketsPerValidator; attempt++) {
      if (result[offset] === ResultValues.Error) {
        return Result.error(null, () => `Ring VRF proof generation failed for validator ${v}, attempt ${attempt}`);
      }
      const signature = Bytes.fromBlob(
        result.subarray(offset + 1, offset + GENERATE_RESULT_ENTRY_LENGTH),
        BANDERSNATCH_PROOF_BYTES,
      ).asOpaque();
      tickets.push(SignedTicket.create({ attempt: tryAsTicketAttempt(attempt), signature }));
      offset += GENERATE_RESULT_ENTRY_LENGTH;
    }
    perValidator.push(tickets);
  }

  return Result.ok(perValidator);
}
```
