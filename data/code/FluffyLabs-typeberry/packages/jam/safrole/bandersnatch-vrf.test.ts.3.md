---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L103-L135
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 9
content_sha: 364ff12b74cd595778947719bfca1766e3635c3125ea9c83b2eb3d8cab6fc980
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 103–135)

```typescript
        "0x3a5d10abc80dda33fe3f40b3bb2e3eefd3e97dda3d617a860c9d94eb70b832ad",
      ].map((x) => Bytes.parseBytes(x, HASH_SIZE));

      const result = await bandersnatchVrf.verifyTickets(
        await bandersnatchWasm,
        bandersnatchKeys.length,
        commitment,
        tickets,
        entropy,
      );

      assert.strictEqual(
        result.every((x) => x.isValid),
        true,
      );
      assert.deepStrictEqual(
        result.map((x) => x.entropyHash.toString()),
        expectedIds.map((x) => x.toString()),
      );
    });

    it("should detect that one signature is incorrect", async () => {
      const tickets = [
        {
          attempt: attempt(1),
          signature: Bytes.parseBytes(
            "0x9ddee7bb67268130bbb23889b327e662cbe832884e203148ba9b1e15539702d11dc971f7f7ff10289130f68ce42cc70e3657d35edab1e552bc68da53008d1f58e24d90fdf1a5d78204c2c32333147976c124725b87ec1861e1ebd6252f79dc6c891567467d39221b6110f5cb2ba389dba903af3fde624596f845202fcc4c96e6bca7537d37b5898ef0a90a916658fb17e2cca588b7b6e96816d8683fe5028c09fc0b8cbedc791c83eab0a39434f1007d4dab587dbfc172e7d4852e5cac6810188c521baa47ff355a99a28380d06f16b4aa3b51aac66b8a6d7bc4454b8d0f676d837caf35f2ab3c4b9ec8cd0e8fadd16e8d6db123d2815dbfa6cbe74866ed9855eecbbab8e2011f84f71a2e360caeac3bcd64c4b46b11ca167e238cf5f0ccfe7f86e27d7eefac788236c548592c6d2c64c12793657caa701d418926fd952e7ba6c211a8f593b38e81f775b16be47e2f76904b5504dfbe5d64c1bcee3180f6d1cf1fc2c597f08afb1bc5213492bd9c84060ce3cb8d531e463078bac747cd66ec326e8e0171ce5d048c3839379ab96ef988130d639a15b9a76946400de42062563441394ec1f6d7f7ce90b7231325015c3f550096537c2ae86f3c774ca4265bd745b2e7365bd9478af0c389467cc34615c89cf8ff337a88d3cd2b2e1f411f714369668f0b4fa2dbb0de3c526e3a9649e82d772dc8de2259be43e3ef7508b5caeb5d57b91eaf140f89f73a57101455a87edeb10374c30a7f2b73df7b2c70c8079f415425bf10597154980bb2cc5fc209167f3b76a305d3bdc3cf6674d95c64e64734fe5af78b235945008072bcd4ae5b605bdd10ba145db56850dab84140dbb0875baba0bf1966ce71ef19770031724a2bce508498a4ff485b3089ac415c8d78dcc6ec9c02a51227875fba7bc16475de074759fa210a2723d21e5aaa0abf5eec706fc8e323c82d7aab7ed3dec320ca15aa1783707f520169ac77adaef95e7ce853b376c1b9e6425d01992fc8fc65d5e49ad47d3ba105094d37c291a287e42d37ce15873ebcb3fbc342ede527e47aea9736914f6e4b8acfa408487d5959352ac9ed48fbf01386c5db0300a7fa5b16aa4942d1",
            BANDERSNATCH_PROOF_BYTES,
          ).asOpaque(),
        },
        {
          attempt: attempt(2),
          signature: Bytes.parseBytes(
```
