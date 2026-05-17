---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.test.ts#L213-L255
title: sdk/jam/accumulate/admin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 17cad47740508c1560e5c1c46930e6b606aeec688e92d20c42564b2d641dbd6e
language: typescript
---
`sdk/jam/accumulate/admin.test.ts` (lines 213–255)

```typescript
  // ─── designate ─────────────────────────────────────────────────────

  test("Admin.designate encodes validator keys", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    const ed = Bytes32.zero();
    ed.raw[0] = 0xe0;
    const band = Bytes32.zero();
    band.raw[0] = 0xb0;
    const bls = BytesBlob.zero(144);
    bls.raw[0] = 0xbb;
    const meta = BytesBlob.zero(128);
    meta.raw[0] = 0xaa;

    const key = ValidatorKey.create(ed, band, bls, meta);
    const result = admin.designate([key]);
    a.isEqual(result.isOkay, true, "should be ok");

    // Verify validators encoding: Ed25519(32) + Bandersnatch(32) + BLS(144) + metadata(128) = 336 bytes
    const validatorsEnc = Encoder.create();
    validatorsEnc.bytesFixLen(ed.bytes);
    validatorsEnc.bytesFixLen(band.bytes);
    validatorsEnc.bytesFixLen(bls);
    validatorsEnc.bytesFixLen(meta);
    const validatorsActual = BytesBlob.wrap(readFromMemory(TestPrivileged.getLastDesignateValidatorsPtr(), 336));
    a.isEqualBytes(validatorsActual, validatorsEnc.finish(), "validators");
    return a;
  }),

  test("Admin.designate returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setDesignateResult(EcalliResult.HUH);
    const result = admin.designate([]);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, DesignateError.Huh, "should be Huh");
    return a;
  }),
];
```
