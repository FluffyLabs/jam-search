---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/key-derivation.test.ts#L334-L445
title: packages/core/crypto/key-derivation.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 2a48aa2fe245e4165b8771809d1da2b08c1fc5434130be81a722006a8d1ec9ce
language: typescript
---
`packages/core/crypto/key-derivation.test.ts` (lines 334–445)

```typescript
  it("should derive from seed: 2", () => {
    const seed = trivialSeed(tryAsU32(2));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("3d71dc0ffd02d90524fda3e4a220e7ec514a258c59457d3077ce4d4f003fd98a").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: 3", () => {
    const seed = trivialSeed(tryAsU32(3));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("107a9148b39a1099eeaee13ac0e3c6b9c256258b51c967747af0f8749398a276").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: 4", () => {
    const seed = trivialSeed(tryAsU32(4));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("0bb36f5ba8e3ba602781bb714e67182410440ce18aa800c4cb4dd22525b70409").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: 5", () => {
    const seed = trivialSeed(tryAsU32(5));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("75e73b8364bf4753c5802021c6aa6548cddb63fe668e3cacf7b48cdb6824bb09").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });

  it("should derive from seed: f92d...d9d1", () => {
    const seed = Bytes.fromBlob(
      Bytes.parseBlobNoPrefix("f92d680ea3f0ac06307795490d8a03c5c0d4572b5e0a8cffec87e1294855d9d1").raw,
      SEED_SIZE,
    ).asOpaque<KeySeed>();
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    assert.deepStrictEqual(
      bandersnatch_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("06154d857537a9b622a9a94b1aeee7d588db912bfc914a8a9707148bfba3b9d1").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchSecretSeed>(),
    );
  });
});

describe("Key Derivation: Bandersnatch public key", () => {
  let blake2b: Blake2b;

  before(async () => {
    blake2b = await Blake2b.createHasher();
  });

  it("should derive from seed: 0", () => {
    const seed = trivialSeed(tryAsU32(0));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("ff71c6c03ff88adb5ed52c9681de1629a54e702fc14729f6b50d2f0a76f185b3").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: 1", () => {
    const seed = trivialSeed(tryAsU32(1));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("dee6d555b82024f1ccf8a1e37e60fa60fd40b1958c4bb3006af78647950e1b91").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: 2", () => {
    const seed = trivialSeed(tryAsU32(2));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("9326edb21e5541717fde24ec085000b28709847b8aab1ac51f84e94b37ca1b66").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: 3", () => {
    const seed = trivialSeed(tryAsU32(3));
```
