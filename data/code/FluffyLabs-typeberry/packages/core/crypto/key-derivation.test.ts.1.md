---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/key-derivation.test.ts#L119-L235
title: packages/core/crypto/key-derivation.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 87857eebb7b3b35f49087849030c1bbc132c265d9ee521e7883f0c5fc53c3cfd
language: typescript
---
`packages/core/crypto/key-derivation.test.ts` (lines 119–235)

```typescript
        Bytes.parseBlobNoPrefix("b81e308145d97464d2bc92d35d227a9e62241a16451af6da5053e309be4f91d7").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: 2", () => {
    const seed = trivialSeed(tryAsU32(2));
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("0093c8c10a88ebbc99b35b72897a26d259313ee9bad97436a437d2e43aaafa0f").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: 3", () => {
    const seed = trivialSeed(tryAsU32(3));
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("69b3a7031787e12bfbdcac1b7a737b3e5a9f9450c37e215f6d3b57730e21001a").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: 4", () => {
    const seed = trivialSeed(tryAsU32(4));
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("b4de9ebf8db5428930baa5a98d26679ab2a03eae7c791d582e6b75b7f018d0d4").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: 5", () => {
    const seed = trivialSeed(tryAsU32(5));
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("4a6482f8f479e3ba2b845f8cef284f4b3208ba3241ed82caa1b5ce9fc6281730").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: f92d...d9d1", () => {
    const seed = Bytes.fromBlob(
      Bytes.parseBlobNoPrefix("f92d680ea3f0ac06307795490d8a03c5c0d4572b5e0a8cffec87e1294855d9d1").raw,
      SEED_SIZE,
    ).asOpaque<KeySeed>();
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("f21e2d96a51387f9a7e5b90203654913dde7fa1044e3eba5631ed19f327d6126").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });
});

describe("Key Derivation: Ed25519 public key", () => {
  let blake2b: Blake2b;

  before(async () => {
    blake2b = await Blake2b.createHasher();
  });

  it("should derive from seed: 0", async () => {
    const seed = trivialSeed(tryAsU32(0));
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("4418fb8c85bb3985394a8c2756d3643457ce614546202a2f50b093d762499ace").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: 1", async () => {
    const seed = trivialSeed(tryAsU32(1));
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("ad93247bd01307550ec7acd757ce6fb805fcf73db364063265b30a949e90d933").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: 2", async () => {
    const seed = trivialSeed(tryAsU32(2));
    const ed25519_secret_seed = deriveEd25519SecretKey(seed, blake2b);
    const ed25519_public_key = await deriveEd25519PublicKey(ed25519_secret_seed);
    assert.deepStrictEqual(
      ed25519_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("cab2b9ff25c2410fbe9b8a717abb298c716a03983c98ceb4def2087500b8e341").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519Key>(),
    );
  });

  it("should derive from seed: 3", async () => {
```
