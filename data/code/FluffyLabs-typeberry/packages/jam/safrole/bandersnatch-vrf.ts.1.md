---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.ts#L120-L234
title: packages/jam/safrole/bandersnatch-vrf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 540d2516c6ffd2f2143b9f4d2e24a10605291a7e63f0ba26db4c106990df2fdd
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.ts` (lines 120–234)

```typescript
  if (ringCommitmentCache.length > MAX_CACHE_ENTRIES) {
    ringCommitmentCache.shift();
  }
  return value;
}

async function getRingCommitmentNoCache(
  bandersnatch: BandernsatchWasm,
  keys: BytesBlob,
): Promise<Result<BandersnatchRingRoot, null>> {
  const commitmentResult = await bandersnatch.getRingCommitment(keys.raw);

  if (commitmentResult[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, () => "Bandersnatch ring commitment calculation failed");
  }

  return Result.ok(Bytes.fromBlob(commitmentResult.subarray(1), BANDERSNATCH_RING_ROOT_BYTES).asOpaque());
}

// One byte for result discriminator (`ResultValues`) and the rest is entropy hash.
const TICKET_RESULT_LENGTH = 1 + HASH_SIZE;

async function verifyTickets(
  bandersnatch: BandernsatchWasm,
  numberOfValidators: number,
  epochRoot: BandersnatchRingRoot,
  tickets: readonly SignedTicket[],
  entropy: EntropyHash,
): Promise<{ isValid: boolean; entropyHash: EntropyHash }[]> {
  const contextLength = entropy.length + JAM_TICKET_SEAL.length + 1;

  const ticketsData = BytesBlob.blobFromParts(
    tickets.map(
      (ticket) =>
        BytesBlob.blobFromParts([ticket.signature.raw, JAM_TICKET_SEAL, entropy.raw, Uint8Array.of(ticket.attempt)])
          .raw,
    ),
  ).raw;

  const verificationResult = await bandersnatch.batchVerifyTicket(
    numberOfValidators,
    epochRoot.raw,
    ticketsData,
    contextLength,
  );
  return Array.from(BytesBlob.blobFrom(verificationResult).chunks(TICKET_RESULT_LENGTH)).map((result) => ({
    isValid: result.raw[RESULT_INDEX] === ResultValues.Ok,
    entropyHash: Bytes.fromBlob(result.raw.subarray(1, TICKET_RESULT_LENGTH), HASH_SIZE).asOpaque(),
  }));
}

async function generateSeal(
  bandersnatch: BandernsatchWasm,
  authorKey: BandersnatchSecretSeed,
  input: BytesBlob,
  auxData: BytesBlob,
): Promise<Result<BandersnatchVrfSignature, null>> {
  const result = await bandersnatch.generateSeal(authorKey.raw, input.raw, auxData.raw);

  if (result[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, () => "Seal generation failed");
  }

  return Result.ok(Bytes.fromBlob(result.subarray(1), BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque());
}

export type VrfOutputHash = Opaque<OpaqueHash, "VRF Output Hash">;

async function getVrfOutputHash(
  bandersnatch: BandernsatchWasm,
  authorKey: BandersnatchSecretSeed,
  input: BytesBlob,
): Promise<Result<VrfOutputHash, null>> {
  const result = await bandersnatch.getVrfOutputHash(authorKey.raw, input.raw);

  if (result[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, () => "VRF output hash generation failed");
  }

  return Result.ok(Bytes.fromBlob(result.subarray(1), HASH_SIZE).asOpaque());
}

// One byte for result discriminator and the rest is the ring VRF signature.
const GENERATE_RESULT_ENTRY_LENGTH = 1 + BANDERSNATCH_PROOF_BYTES;

/**
 * Generates signed tickets for all attempts at once using batch ring VRF.
 */
async function generateTickets(
  bandersnatch: BandernsatchWasm,
  ringKeys: BandersnatchKey[],
  proverKeyIndex: number,
  key: BandersnatchSecretSeed,
  entropy: EntropyHash,
  ticketsPerValidator: number,
): Promise<Result<SignedTicket[], null>> {
  // Build VRF inputs: JAM_TICKET_SEAL || entropy || attempt_byte for each attempt
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
```
