---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L153-L226
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 6
chunk_total: 9
content_sha: f840b3d41b05831f30b6cfece1cfd8545bde4c48848e365b56a1a7e8efa9c4ef
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 153–226)

```typescript
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ].map((x) => Bytes.parseBytes(x, HASH_SIZE));

      const result = await bandersnatchVrf.verifyTickets(
        await bandersnatchWasm,
        bandersnatchKeys.length,
        commitment,
        tickets,
        entropy,
      );

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(
        result.tickets.map((x) => x.toString()),
        expectedIds.map((x) => x.toString()),
      );
    });
  });

  describe("verifySeal", () => {
    const keys = BytesBlob.parseBlob(
      "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e3348e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
    );
    const authorIndex = tryAsValidatorIndex(4);

    it("should verify seal with some aux data", async () => {
      const signature = BytesBlob.parseBlob(
        "0xa060e079fdeefc27d1278b9a3d1922874c87e8d0dc7885d08443a29a460af82701bf291885c3c1d84f439688abb435ab1c5cf29baaa1cff157d2731ee748a005032620b6bdc3282b7dd8c54d0e71ad8577cdda0736841cff87394c4ab52d610e",
      );
      const payload = BytesBlob.parseBlob(
        "0x6a616d5f66616c6c6261636b5f7365616cd2d34655ebcad804c56d2fd5f932c575b6a5dbb3f5652c5202bcc75ab9c2cc95",
      );
      const auxData = BytesBlob.parseBlob(
        "0x476243ad7cc4fc49cb6cb362c6568e931731d8650d917007a6037cceedd6224499f227c2137bc71b415c18e4eb74c6450e575af3708d52cb40ea15dee1ce574a189d15af832dfe4f67744008b62c334b569fcbb4c261e0f065655697306ca2520c000000016f6ad2224d7d58aec6573c623ab110700eaca20a48dc2965d535e466d524af2a835ac82bfa2ce8390bb50680d4b7a73dfa2a4cff6d8c30694b24a605f9574eaf5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e3348e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d000004004b213bfc74f65eb109896f1d57e78809d1a94c0c1b2e4543a9ee470eb6cfdfee96228bd01847dbe9e92c5c8c190fab85da4cb5ecd63cd3c758730b17b1247d1be6a5107ff246b08fbf8dcad39ba00b33e9ee4e2b934f62ee7e503e2a1eeaba11",
      );

      const result = await (await bandersnatchWasm).verifySeal(
        Array.from(keys.chunks(BANDERSNATCH_KEY_BYTES))[authorIndex].raw,
        signature.raw,
        payload.raw,
        auxData.raw,
      );

      assert.deepStrictEqual(
        BytesBlob.blobFrom(result).toString(),
        "0x001286e739f65659311c7f3380ec9afad3560bc2971a0ea1d0acc961d79c0cf4c4",
      );
    });

    it("should verify seal without aux data", async () => {
      const signature = BytesBlob.parseBlob(
        "0x4b213bfc74f65eb109896f1d57e78809d1a94c0c1b2e4543a9ee470eb6cfdfee96228bd01847dbe9e92c5c8c190fab85da4cb5ecd63cd3c758730b17b1247d1be6a5107ff246b08fbf8dcad39ba00b33e9ee4e2b934f62ee7e503e2a1eeaba11",
      );
      const payload = BytesBlob.parseBlob(
        "0x6a616d5f656e74726f70791286e739f65659311c7f3380ec9afad3560bc2971a0ea1d0acc961d79c0cf4c4",
      );
      const auxData = BytesBlob.parseBlob("0x");

      const result = await (await bandersnatchWasm).verifySeal(
        Array.from(keys.chunks(BANDERSNATCH_KEY_BYTES))[authorIndex].raw,
        signature.raw,
        payload.raw,
        auxData.raw,
      );

      assert.deepStrictEqual(
        BytesBlob.blobFrom(result).toString(),
        "0x00543054132a05c2710ac8fd0924810d3a8f7b7a7637c31a35cf6a05d54122529f",
      );
    });
  });

```
