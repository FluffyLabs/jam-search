---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L217-L313
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 7
chunk_total: 9
content_sha: 09c32e5efac2bba7494c81fa7dbea8da375332e641ebdc31617ba32ee3334b48
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 217–313)

```typescript
        auxData.raw,
      );

      assert.deepStrictEqual(
        BytesBlob.blobFrom(result).toString(),
        "0x00543054132a05c2710ac8fd0924810d3a8f7b7a7637c31a35cf6a05d54122529f",
      );
    });
  });

  describe("generateSeal", () => {
    it("should generate a valid seal", async () => {
      const secretSeed = Bytes.fill(SEED_SIZE, 1).asOpaque();
      const input = BytesBlob.blobFromString("example input");
      const auxData = BytesBlob.blobFromString("example aux data");
      const expectedSeal = Bytes.parseBytes(
        "0x0b6c772fe61e4e7252722633475c998be3bfcabcda2efff75edaa7c6c889f4df832618f0679ff329ca154a1e495a64939756928fbfb7d50587348584d0ad6e09a84014dab23c7493031bba1a2efe727cea82fe1f7c2f0d9777f0d40761083007",
        BANDERSNATCH_VRF_SIGNATURE_BYTES,
      ).asOpaque();

      const result = await bandersnatchVrf.generateSeal(await bandersnatchWasm, secretSeed, input, auxData);

      deepEqual(result, Result.ok(expectedSeal));
    });

    it("should generate two seals that are the same on first 32 bytes", async () => {
      const secretSeed = Bytes.fill(SEED_SIZE, 1).asOpaque();
      const input = BytesBlob.blobFromString("example input");
      const auxData1 = BytesBlob.blobFromString("example aux data1");
      const auxData2 = BytesBlob.blobFromString("example aux data2");

      const result1 = await bandersnatchVrf.generateSeal(await bandersnatchWasm, secretSeed, input, auxData1);
      const result2 = await bandersnatchVrf.generateSeal(await bandersnatchWasm, secretSeed, input, auxData2);

      if (result1.isError || result2.isError) {
        throw new Error("Seal generation failed");
      }

      deepEqual(
        BytesBlob.blobFrom(result1.ok.raw.subarray(0, HASH_SIZE)),
        BytesBlob.blobFrom(result2.ok.raw.subarray(0, HASH_SIZE)),
      );
      assert.notDeepEqual(result1.ok, result2.ok);
    });

    it("should generate and verify seal", async () => {
      const secretSeed = Bytes.fill(SEED_SIZE, 1).asOpaque();
      const pubKey = deriveBandersnatchPublicKey(secretSeed);
      const input = BytesBlob.blobFromString("example input");
      const auxData = BytesBlob.blobFromString("example aux data");
      const expectedSeal = Bytes.parseBytes(
        "0x0b6c772fe61e4e7252722633475c998be3bfcabcda2efff75edaa7c6c889f4df832618f0679ff329ca154a1e495a64939756928fbfb7d50587348584d0ad6e09a84014dab23c7493031bba1a2efe727cea82fe1f7c2f0d9777f0d40761083007",
        BANDERSNATCH_VRF_SIGNATURE_BYTES,
      ).asOpaque();

      const generationResult = await bandersnatchVrf.generateSeal(await bandersnatchWasm, secretSeed, input, auxData);

      deepEqual(generationResult, Result.ok(expectedSeal));

      if (generationResult.isError) {
        throw new Error("Seal generation failed");
      }
      const verificationResult = await bandersnatchVrf.verifySeal(
        await bandersnatchWasm,
        pubKey,
        generationResult.ok,
        input,
        auxData,
      );
      const expected: typeof verificationResult = Result.ok(
        Bytes.parseBytes("0x000b0e5c06e70a23d6cfed372763de718b0c21119ea51f7afe1e69b0000de620", HASH_SIZE).asOpaque(),
      );

      deepEqual(verificationResult, expected);
    });
  });

  describe("generateTickets", () => {
    it("should generate tickets that pass verification (consistency check)", async () => {
      // Generate tickets and verify them - checks consistency between generate and verify
      const secrets = [0, 1, 2].map((i) => Bytes.fill(SEED_SIZE, i).asOpaque());
      const ringKeys = secrets.map((secret) => deriveBandersnatchPublicKey(secret));

      const proverIndex = 0;
      const entropy = Bytes.fill(HASH_SIZE, 123).asOpaque();

      const genResult = await bandersnatchVrf.generateTickets(
        await bandersnatchWasm,
        ringKeys,
        [proverIndex],
        [secrets[proverIndex]],
        entropy,
        2,
      );

      assert.ok(genResult.isOk);

```
