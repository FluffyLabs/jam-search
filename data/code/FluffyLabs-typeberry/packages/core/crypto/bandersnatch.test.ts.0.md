---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/bandersnatch.test.ts#L1-L23
title: packages/core/crypto/bandersnatch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: ccd978a1c088bccae32a33dbda390530d4aa598c1e03f9ce23dd0cf3a12cffbb
language: typescript
---
`packages/core/crypto/bandersnatch.test.ts` (lines 1–23)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import type { BandersnatchKey } from "./bandersnatch.js";
import { initWasm } from "./index.js";
import { type BandersnatchSecretSeed, deriveBandersnatchPublicKey, SEED_SIZE } from "./key-derivation.js";

before(initWasm);

describe("BandersnatchKey Derivation", () => {
  it("should derive a valid Bandersnatch public key from a secret seed", () => {
    const seed = Bytes.fromBlob(
      Bytes.parseBlobNoPrefix("007596986419e027e65499cc87027a236bf4a78b5e8bd7f675759d73e7a9c799").raw,
      SEED_SIZE,
    ).asOpaque<BandersnatchSecretSeed>();
    const publicKey = deriveBandersnatchPublicKey(seed);
    const expected = Bytes.fromBlob(
      Bytes.parseBlobNoPrefix("ff71c6c03ff88adb5ed52c9681de1629a54e702fc14729f6b50d2f0a76f185b3").raw,
      SEED_SIZE,
    ).asOpaque<BandersnatchKey>();
    assert.deepEqual(publicKey, expected);
  });
});
```
