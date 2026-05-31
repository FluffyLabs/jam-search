---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/key-derivation.test.ts#L1-L126
title: packages/core/crypto/key-derivation.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 5
content_sha: b11007efe053c8cb7fb87bd18b950bcc472090e49096e8649c9f83383139d88e
language: typescript
---
`packages/core/crypto/key-derivation.test.ts` (lines 1–126)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { Blake2b } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import { deepEqual } from "@typeberry/utils";
import type { BandersnatchKey } from "./bandersnatch.js";
import type { Ed25519Key } from "./ed25519.js";
import { initWasm } from "./index.js";
import {
  type BandersnatchSecretSeed,
  deriveBandersnatchPublicKey,
  deriveBandersnatchSecretKey,
  deriveEd25519PublicKey,
  deriveEd25519SecretKey,
  type Ed25519SecretSeed,
  type KeySeed,
  SEED_SIZE,
  trivialSeed,
} from "./key-derivation.js";

before(initWasm);

describe("Key Derivation: trivial seed", () => {
  it("should derive a valid seed: 0", () => {
    const seed = trivialSeed(tryAsU32(0));
    assert.deepStrictEqual(seed, Bytes.zero(SEED_SIZE));
  });
  it("should derive a valid seed: 1", () => {
    const seed = trivialSeed(tryAsU32(1));
    assert.deepStrictEqual(
      seed,
      Bytes.fromNumbers(
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        SEED_SIZE,
      ).asOpaque<KeySeed>(),
    );
  });
  it("should derive a valid seed: 2", () => {
    const seed = trivialSeed(tryAsU32(2));
    assert.deepStrictEqual(
      seed,
      Bytes.fromNumbers(
        [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
        SEED_SIZE,
      ).asOpaque<KeySeed>(),
    );
  });
  it("should derive a valid seed: 3", () => {
    const seed = trivialSeed(tryAsU32(3));
    assert.deepStrictEqual(
      seed,
      Bytes.fromNumbers(
        [3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0],
        SEED_SIZE,
      ).asOpaque<KeySeed>(),
    );
  });
  it("should derive a valid seed: 4", () => {
    const seed = trivialSeed(tryAsU32(4));
    assert.deepStrictEqual(
      seed,
      Bytes.fromNumbers(
        [4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0],
        SEED_SIZE,
      ).asOpaque<KeySeed>(),
    );
  });
  it("should derive a valid seed: 5", () => {
    const seed = trivialSeed(tryAsU32(5));
    assert.deepStrictEqual(
      seed,
      Bytes.fromNumbers(
        [5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0],
        SEED_SIZE,
      ).asOpaque<KeySeed>(),
    );
  });
  it("should derive a valid seed: deadbeef", () => {
    const seed = trivialSeed(tryAsU32(0xdeadbeef));
    assert.deepStrictEqual(
      seed,
      Bytes.fromNumbers(
        [
          0xef, 0xbe, 0xad, 0xde, 0xef, 0xbe, 0xad, 0xde, 0xef, 0xbe, 0xad, 0xde, 0xef, 0xbe, 0xad, 0xde, 0xef, 0xbe,
          0xad, 0xde, 0xef, 0xbe, 0xad, 0xde, 0xef, 0xbe, 0xad, 0xde, 0xef, 0xbe, 0xad, 0xde,
        ],
        SEED_SIZE,
      ).asOpaque<KeySeed>(),
    );
  });
});

describe("Key Derivation: Ed25519 secret seed", () => {
  let blake2b: Blake2b;

  before(async () => {
    blake2b = await Blake2b.createHasher();
  });

  it("should derive from seed: 0", () => {
    const seed = trivialSeed(tryAsU32(0));
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("996542becdf1e78278dc795679c825faca2e9ed2bf101bf3c4a236d3ed79cf59").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: 1", () => {
    const seed = trivialSeed(tryAsU32(1));
    const ed25519_seed = deriveEd25519SecretKey(seed, blake2b);
    assert.deepStrictEqual(
      ed25519_seed,
      Bytes.fromBlob(
        Bytes.parseBlobNoPrefix("b81e308145d97464d2bc92d35d227a9e62241a16451af6da5053e309be4f91d7").raw,
        SEED_SIZE,
      ).asOpaque<Ed25519SecretSeed>(),
    );
  });

  it("should derive from seed: 2", () => {
    const seed = trivialSeed(tryAsU32(2));
```
