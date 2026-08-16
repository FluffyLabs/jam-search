---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/key-derivation.test.ts#L438-L498
title: packages/core/crypto/key-derivation.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 4
chunk_total: 5
content_sha: ea99de6156fff66073e87349758d853545906f57dacfd0c421396f90fba533f4
language: typescript
---
`packages/core/crypto/key-derivation.test.ts` (lines 438–498)

```typescript
        Bytes.parseBlobNoPrefix("9326edb21e5541717fde24ec085000b28709847b8aab1ac51f84e94b37ca1b66").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: 3", () => {
    const seed = trivialSeed(tryAsU32(3));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("0746846d17469fb2f95ef365efcab9f4e22fa1feb53111c995376be8019981cc").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: 4", () => {
    const seed = trivialSeed(tryAsU32(4));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("151e5c8fe2b9d8a606966a79edd2f9e5db47e83947ce368ccba53bf6ba20a40b").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: 5", () => {
    const seed = trivialSeed(tryAsU32(5));
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("2105650944fcd101621fd5bb3124c9fd191d114b7ad936c1d79d734f9f21392e").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });

  it("should derive from seed: f92d...d9d1", () => {
    const seed = Bytes.fromBlob(
      Bytes.parseBlobNoPrefix("f92d680ea3f0ac06307795490d8a03c5c0d4572b5e0a8cffec87e1294855d9d1").raw,
      SEED_SIZE,
    ).asOpaque<KeySeed>();
    const bandersnatch_seed = deriveBandersnatchSecretKey(seed, blake2b);
    const bandersnatch_public_key = deriveBandersnatchPublicKey(bandersnatch_seed);
    deepEqual(
      bandersnatch_public_key,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("299bdfd8d615aadd9e6c58718f9893a5144d60e897bc9da1f3d73c935715c650").raw,
        SEED_SIZE,
      ).asOpaque<BandersnatchKey>(),
    );
  });
});
```
