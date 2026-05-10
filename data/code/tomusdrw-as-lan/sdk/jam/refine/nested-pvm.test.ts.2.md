---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/nested-pvm.test.ts#L174-L188
title: sdk/jam/refine/nested-pvm.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 2
chunk_total: 3
content_sha: b2b6366a2916a403dbfd7cf3c75f6905d6fc07cd990413f4ba89f0889866fe4d
language: typescript
---
`sdk/jam/refine/nested-pvm.test.ts` (lines 174–188)

```typescript
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
