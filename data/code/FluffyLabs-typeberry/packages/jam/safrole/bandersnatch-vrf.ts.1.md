---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.ts#L128-L239
title: packages/jam/safrole/bandersnatch-vrf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 1430741db6e1597f170409b30b742b69f5688e4e6d361088c9c67a395abb0f43
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.ts` (lines 128–239)

```typescript
): Promise<Result<BandersnatchRingRoot, null>> {
  const keys = BytesBlob.blobFromParts(validators.map((x) => x.raw));
  const cacheEntry = ringCommitmentCache.find((v) => v.keys.isEqualTo(keys));
  if (cacheEntry !== undefined) {
    return cacheEntry.value;
  }

  const value = getRingCommitmentNoCache(bandersnatch, keys);
  ringCommitmentCache[ringCommitmentIndex] = {
    keys,
    value,
  };
  // move the index to point at next entry to override.
  ringCommitmentIndex = (ringCommitmentIndex + 1) % ringCommitmentCache.length;
  return value;
}

const RING_COMMITMENT_FAILED = () => "Bandersnatch ring commitment calculation failed";
async function getRingCommitmentNoCache(
  bandersnatch: BandernsatchWasm,
  keys: BytesBlob,
): Promise<Result<BandersnatchRingRoot, null>> {
  const commitmentResult = await bandersnatch.getRingCommitment(keys.raw);

  if (commitmentResult[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, RING_COMMITMENT_FAILED);
  }

  return Result.ok(Bytes.fromBlob(commitmentResult.subarray(1), BANDERSNATCH_RING_ROOT_BYTES).asOpaque());
}

async function verifyTickets(
  bandersnatch: BandernsatchWasm,
  numberOfValidators: number,
  epochRoot: BandersnatchRingRoot,
  tickets: readonly SignedTicket[],
  entropy: EntropyHash,
): Promise<{ isValid: boolean; tickets: EntropyHash[] }> {
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
  const isValid = verificationResult[RESULT_INDEX] === ResultValues.Ok;
  // NOTE: in case of failure, the hashes will be all zeros, but we can safely
  // keep the same code path.
  const chunks = BytesBlob.blobFrom(verificationResult.subarray(1)).chunks(HASH_SIZE);
  const results: EntropyHash[] = [];
  for (const entropyHash of chunks) {
    results.push(Bytes.fromBlob(entropyHash.raw, HASH_SIZE).asOpaque());
  }
  return { isValid, tickets: results };
}

const SEAL_FAILED_ERROR = () => "Seal generation failed";
async function generateSeal(
  bandersnatch: BandernsatchWasm,
  authorKey: BandersnatchSecretSeed,
  input: BytesBlob,
  auxData: BytesBlob,
): Promise<Result<BandersnatchVrfSignature, null>> {
  const result = await bandersnatch.generateSeal(authorKey.raw, input.raw, auxData.raw);

  if (result[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, SEAL_FAILED_ERROR);
  }

  return Result.ok(Bytes.fromBlob(result.subarray(1), BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque());
}

export type VrfOutputHash = Opaque<OpaqueHash, "VRF Output Hash">;

const VRF_OUTPUT_FAILED = () => "VRF output hash generation failed";
async function getVrfOutputHash(
  bandersnatch: BandernsatchWasm,
  authorKey: BandersnatchSecretSeed,
  input: BytesBlob,
): Promise<Result<VrfOutputHash, null>> {
  const result = await bandersnatch.getVrfOutputHash(authorKey.raw, input.raw);

  if (result[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, VRF_OUTPUT_FAILED);
  }

  return Result.ok(Bytes.fromBlob(result.subarray(1), HASH_SIZE).asOpaque());
}

// One byte for result discriminator and the rest is the ring VRF signature.
const GENERATE_RESULT_ENTRY_LENGTH = 1 + BANDERSNATCH_PROOF_BYTES;

/**
 * Batch-generate signed tickets for multiple validators in a single native call,
 * reusing the ring prover setup across all of them. Returns one ticket list per
 * validator, in the same order as `proverKeyIndices`/`secrets`.
 */
async function generateTickets(
  bandersnatch: BandernsatchWasm,
  ringKeys: BandersnatchKey[],
  proverKeyIndices: readonly number[],
  secrets: readonly BandersnatchSecretSeed[],
  entropy: EntropyHash,
```
