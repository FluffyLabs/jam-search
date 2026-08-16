---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-wasm.ts#L1-L85
title: packages/jam/safrole/bandersnatch-wasm.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1ac17909fc257999703da75197dbc34570c70c74e7f7a85370fb3243e23e873d
language: typescript
---
`packages/jam/safrole/bandersnatch-wasm.ts` (lines 1–85)

```typescript
import { bandersnatchWasm, initWasm } from "@typeberry/crypto";

export class BandernsatchWasm {
  private constructor() {}

  static async new() {
    await initWasm();
    return new BandernsatchWasm();
  }

  async verifySeal(authorKey: Uint8Array, signature: Uint8Array, payload: Uint8Array, auxData: Uint8Array) {
    return bandersnatchWasm.verifySeal(authorKey, signature, payload, auxData);
  }

  async verifyHeaderSeals(
    authorKey: Uint8Array,
    headerSeal: Uint8Array,
    headerSealPayload: Uint8Array,
    unsealedHeader: Uint8Array,
    entropySeal: Uint8Array,
    entropyPayloadPrefix: Uint8Array,
  ) {
    return bandersnatchWasm.verifyHeaderSeals(
      authorKey,
      headerSeal,
      headerSealPayload,
      unsealedHeader,
      entropySeal,
      entropyPayloadPrefix,
    );
  }

  async getRingCommitment(keys: Uint8Array) {
    return bandersnatchWasm.ringCommitment(keys);
  }

  async batchVerifyTicket(ringSize: number, commitment: Uint8Array, ticketsData: Uint8Array, contextLength: number) {
    return bandersnatchWasm.batchVerifyTickets(ringSize, commitment, ticketsData, contextLength);
  }

  async generateSeal(authorKey: Uint8Array, input: Uint8Array, auxData: Uint8Array) {
    return bandersnatchWasm.generateSeal(authorKey, input, auxData);
  }

  async getVrfOutputHash(authorKey: Uint8Array, input: Uint8Array) {
    return bandersnatchWasm.vrfOutputHash(authorKey, input);
  }

  async batchGenerateRingVrf(
    ringKeys: Uint8Array,
    proverKeyIndex: number,
    secretSeed: Uint8Array,
    inputsData: Uint8Array,
    vrfInputDataLen: number,
  ) {
    return bandersnatchWasm.batchGenerateRingVrf(ringKeys, proverKeyIndex, secretSeed, inputsData, vrfInputDataLen);
  }

  /**
   * Batch-generate ring VRF tickets for multiple validators in a single call,
   * reusing the ring prover setup across all of them.
   *
   * `secretSeedsData` is the fixed-width concatenation of the validators' secret
   * seeds (each `secretSeedDataLen` bytes); `proverKeyIndices` are their indices
   * within the ring and must have the same count. Output records are ordered
   * validator-major then input-major, each `status byte || signature`.
   */
  async batchGenerateRingVrfForValidators(
    ringKeys: Uint8Array,
    proverKeyIndices: Uint32Array,
    secretSeedsData: Uint8Array,
    secretSeedDataLen: number,
    inputsData: Uint8Array,
    vrfInputDataLen: number,
  ) {
    return bandersnatchWasm.batchGenerateRingVrfForValidators(
      ringKeys,
      proverKeyIndices,
      secretSeedsData,
      secretSeedDataLen,
      inputsData,
      vrfInputDataLen,
    );
  }
}
```
