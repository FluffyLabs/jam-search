---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-wasm.ts#L1-L58
title: packages/jam/safrole/bandersnatch-wasm.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: ec22be8de7ea008c9ee6d1868775a42967dc8bc212dff08d1e0997e15aab768f
language: typescript
---
`packages/jam/safrole/bandersnatch-wasm.ts` (lines 1–58)

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
}
```
