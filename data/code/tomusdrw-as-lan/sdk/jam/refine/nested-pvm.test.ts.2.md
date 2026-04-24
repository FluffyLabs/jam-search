---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/nested-pvm.test.ts#L173-L188
title: sdk/jam/refine/nested-pvm.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 2
chunk_total: 3
content_sha: 5777a3ccd593422c33fac9931508e91a01f0e585b99c3ff845b00674a227d87d
language: typescript
---
`sdk/jam/refine/nested-pvm.test.ts` (lines 173–188)

```typescript
    a.isEqual(r.isError, true, "is error");
    a.isEqual(r.error, SpiError.TrailingBytes, "error variant");
    return a;
  }),

  test("NestedPvm.fromSpiChecked returns InvalidEntryPoint when host rejects code", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestMachine.setMachineResult(EcalliResult.HUH);
    const blob = buildSpi(BytesBlob.empty(), BytesBlob.empty(), 0, 0, BytesBlob.zero(4));
    const r = NestedPvm.fromSpiChecked(blob, BytesBlob.empty(), 100);
    a.isEqual(r.isError, true, "is error");
    a.isEqual(r.error, SpiError.InvalidEntryPoint, "error variant");
    return a;
  }),
];
```
