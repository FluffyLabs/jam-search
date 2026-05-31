---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.ts#L1-L128
title: packages/jam/safrole/bandersnatch-vrf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 3f5a43d94cde29ae8b2f0afbbe2081b74d9b97b81e5132297ef0ca595678a75b
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.ts` (lines 1–128)

```typescript
import type { EntropyHash } from "@typeberry/block";
import { SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import type { BandersnatchKey, BandersnatchSecretSeed } from "@typeberry/crypto";
import {
  BANDERSNATCH_PROOF_BYTES,
  BANDERSNATCH_RING_ROOT_BYTES,
  BANDERSNATCH_VRF_SIGNATURE_BYTES,
  type BandersnatchRingRoot,
  type BandersnatchVrfSignature,
} from "@typeberry/crypto/bandersnatch.js";
import { HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { type Opaque, Result } from "@typeberry/utils";
import type { BandernsatchWasm } from "./bandersnatch-wasm.js";
import { JAM_TICKET_SEAL } from "./constants.js";

const RESULT_INDEX = 0 as const;

enum ResultValues {
  Ok = 0,
  Error = 1,
}

/**
 * Getting a ring commitment is pretty expensive (hundreds of ms),
 * yet the validators do not always change.
 * For current benchmarks, we get a huge hit every epoch, hence
 * to overcome that we cache the results of getting ring commitment.
 * Note we can also tentatively populate this cache, before we even
 * reach the epoch change block.
 */
const ringCommitmentCache: CacheEntry[] = [];
type CacheEntry = {
  keys: BytesBlob;
  value: Promise<Result<BandersnatchRingRoot, null>>;
};

const FUNCTIONS = {
  verifySeal,
  verifyHeaderSeals,
  verifyTickets,
  getRingCommitment,
  generateSeal,
  getVrfOutputHash,
  generateTickets,
};

// NOTE [ToDr] We export the entire object to allow mocking in tests.
// Ideally we would just export functions and figure out how to mock
// properly in ESM.
export default FUNCTIONS;

async function verifyHeaderSeals(
  bandersnatch: BandernsatchWasm,
  authorKey: BandersnatchKey,
  signature: BandersnatchVrfSignature,
  payload: BytesBlob,
  encodedUnsealedHeader: BytesBlob,
  entropySignature: BandersnatchVrfSignature,
  entropyPayloadPrefix: BytesBlob,
): Promise<Result<[EntropyHash, EntropyHash], null>> {
  const sealResult = await bandersnatch.verifyHeaderSeals(
    authorKey.raw,
    signature.raw,
    payload.raw,
    encodedUnsealedHeader.raw,
    entropySignature.raw,
    entropyPayloadPrefix.raw,
  );

  if (sealResult[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, () => "Bandersnatch VRF seal verification failed");
  }

  return Result.ok([
    Bytes.fromBlob(sealResult.subarray(1, 33), HASH_SIZE).asOpaque(),
    Bytes.fromBlob(sealResult.subarray(33), HASH_SIZE).asOpaque(),
  ]);
}

async function verifySeal(
  bandersnatch: BandernsatchWasm,
  authorKey: BandersnatchKey,
  signature: BandersnatchVrfSignature,
  payload: BytesBlob,
  encodedUnsealedHeader: BytesBlob,
): Promise<Result<EntropyHash, null>> {
  const sealResult = await bandersnatch.verifySeal(
    authorKey.raw,
    signature.raw,
    payload.raw,
    encodedUnsealedHeader.raw,
  );

  if (sealResult[RESULT_INDEX] === ResultValues.Error) {
    return Result.error(null, () => "Bandersnatch VRF seal verification failed");
  }

  return Result.ok(Bytes.fromBlob(sealResult.subarray(1), HASH_SIZE).asOpaque());
}

function getRingCommitment(
  bandersnatch: BandernsatchWasm,
  validators: BandersnatchKey[],
): Promise<Result<BandersnatchRingRoot, null>> {
  const keys = BytesBlob.blobFromParts(validators.map((x) => x.raw));
  // We currently compare the large bytes blob, but the number of entries in the cache
  // must be low. If the cache ever grows larger, we should rather consider hashing the keys.
  const MAX_CACHE_ENTRIES = 3;
  const cacheEntry = ringCommitmentCache.find((v) => v.keys.isEqualTo(keys));
  if (cacheEntry !== undefined) {
    return cacheEntry.value;
  }

  const value = getRingCommitmentNoCache(bandersnatch, keys);
  ringCommitmentCache.push({
    keys,
    value,
  });
  if (ringCommitmentCache.length > MAX_CACHE_ENTRIES) {
    ringCommitmentCache.shift();
  }
  return value;
}

async function getRingCommitmentNoCache(
  bandersnatch: BandernsatchWasm,
  keys: BytesBlob,
```
