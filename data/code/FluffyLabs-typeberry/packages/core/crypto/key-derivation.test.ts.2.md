---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/key-derivation.test.ts#L229-L339
title: packages/core/crypto/key-derivation.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 5
content_sha: 86cda4d17e397fb5238f9fded576fbb2f08f61d40bae7577606f30f2adc123fe
language: typescript
---
`packages/core/crypto/key-derivation.test.ts` (lines 229–339)

```typescript
        Bytes.parseBlobNoPrefix("cab2b9ff25c2410fbe9b8a717abb298c716a03983c98ceb4def2087500b8e341").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: 3", async () => {
    const seed = trivialSeed(tryAsU32(3));
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("f30aa5444688b3cab47697b37d5cac5707bb3289e986b19b17db437206931a8d").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: 4", async () => {
    const seed = trivialSeed(tryAsU32(4));
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("8b8c5d436f92ecf605421e873a99ec528761eb52a88a2f9a057b3b3003e6f32a").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: 5", async () => {
    const seed = trivialSeed(tryAsU32(5));
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("ab0084d01534b31c1dd87c81645fd762482a90027754041ca1b56133d0466c06").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: f92d...d9d1", async () => {
    const seed = Bytes.fromBlob(
      Bytes.parseBlobNoPrefix("f92d680ea3f0ac06307795490d8a03c5c0d4572b5e0a8cffec87e1294855d9d1").raw,
      SEED_SIZE,
    ).asOpaque<KeySeed>();
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("11a695f674de95ff3daaff9a5b88c18448b10156bf88bc04200e48d5155c7243").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });
});

describe("Key Derivation: Bandersnatch secret seed", () => {
  let blake2b: Blake2b;

  before(async () => {
    blake2b = await Blake2b.createHasher();
  });

  it("should derive from seed: 0", () => {
    const seed = trivialSeed(tryAsU32(0));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("007596986419e027e65499cc87027a236bf4a78b5e8bd7f675759d73e7a9c799").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: 1", () => {
    const seed = trivialSeed(tryAsU32(1));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("12ca375c9242101c99ad5fafe8997411f112ae10e0e5b7c4589e107c433700ac").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: 1", () => {
    const seed = trivialSeed(tryAsU32(1));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("12ca375c9242101c99ad5fafe8997411f112ae10e0e5b7c4589e107c433700ac").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: 2", () => {
    const seed = trivialSeed(tryAsU32(2));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
```
