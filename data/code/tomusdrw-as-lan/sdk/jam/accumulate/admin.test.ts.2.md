---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.test.ts#L218-L245
title: sdk/jam/accumulate/admin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 2
chunk_total: 3
content_sha: fbd584bc952e76a84a6cd9d89b9fbae4649f10cbd2e512265335864c086a46e5
language: typescript
---
`sdk/jam/accumulate/admin.test.ts` (lines 218–245)

```typescript
    const meta = BytesBlob.zero(128);
    meta.raw[0] = 0xaa;

    const key = ValidatorKey.create(ed, band, bls, meta);
    const result = admin.designate([key]);
    a.isEqual(result.isOkay, true, "should be ok");

    // Verify validators encoding: Ed25519(32) + Bandersnatch(32) + BLS(144) + metadata(128) = 336 bytes
    const ptr = TestPrivileged.getLastDesignateValidatorsPtr();
    a.isEqual(load<u8>(ptr), 0xe0, "ed25519[0] = 0xe0");
    a.isEqual(load<u8>(ptr + 32), 0xb0, "bandersnatch[0] = 0xb0");
    a.isEqual(load<u8>(ptr + 64), 0xbb, "bls[0] = 0xbb");
    a.isEqual(load<u8>(ptr + 64 + 144), 0xaa, "metadata[0] = 0xaa");
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
