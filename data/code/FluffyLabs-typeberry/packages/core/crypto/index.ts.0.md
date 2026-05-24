---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/index.ts#L1-L24
title: packages/core/crypto/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 138520fa86335ee69076cf91a55a6c568816c0eca1aaee2b5a227f04f478cfa4
language: typescript
---
`packages/core/crypto/index.ts` (lines 1–24)

```typescript
export { bandersnatch as bandersnatchWasm, initAll as initWasm } from "@typeberry/native";
export type {
  BandersnatchKey,
  BandersnatchProof,
  BandersnatchRingRoot,
  BandersnatchVrfSignature,
  BlsKey,
} from "./bandersnatch.js";

export * as bandersnatch from "./bandersnatch.js";
export {
  BANDERSNATCH_KEY_BYTES,
  BANDERSNATCH_PROOF_BYTES,
  BANDERSNATCH_RING_ROOT_BYTES,
  BANDERSNATCH_VRF_SIGNATURE_BYTES,
  BLS_KEY_BYTES,
} from "./bandersnatch.js";
export type { Ed25519Key, Ed25519Signature } from "./ed25519.js";
export * as ed25519 from "./ed25519.js";
export { ED25519_KEY_BYTES, ED25519_PRIV_KEY_BYTES, ED25519_SIGNATURE_BYTES, Ed25519Pair } from "./ed25519.js";

export type { BandersnatchSecretSeed, Ed25519SecretSeed, KeySeed as PublicKeySeed } from "./key-derivation.js";
export * as keyDerivation from "./key-derivation.js";
export { SEED_SIZE } from "./key-derivation.js";
```
