---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.test.ts#L237-L365
title: examples/ecalli-test/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 873ebe6ba5cded84384699a49e36cb9a4014a83199c9a88b5c112b2c6c830951
language: typescript
---
`examples/ecalli-test/assembly/refine.test.ts` (lines 237–365)

```typescript
    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "pages returns OK");
    return assert;
  }),

  test("invoke: runs inner PVM machine", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Invoke);
    p.varU64(0); // machine_id
    p.bytesVarLen(BytesBlob.zero(8)); // I/O structure

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "invoke returns HALT");
    assert.isEqual(resp.data.raw.length, 8, "invoke returns r8 output");
    return assert;
  }),

  test("expunge: destroys inner machine", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Expunge);
    p.varU64(0); // machine_id

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "expunge returns OK");
    return assert;
  }),

  // === Deeper verification tests ===

  test("export: incrementing segment IDs", () => {
    TestEcalli.reset();
    const p1 = Encoder.create();
    p1.varU64(EcalliIndex.Export);
    p1.bytesVarLen(BytesBlob.zero(8));
    const resp1 = callRefine(p1.finish());

    const p2 = Encoder.create();
    p2.varU64(EcalliIndex.Export);
    p2.bytesVarLen(BytesBlob.zero(8));
    const resp2 = callRefine(p2.finish());

    const assert = Assert.create();
    assert.isEqual(resp1.result, 0, "first export returns index 0");
    assert.isEqual(resp2.result, 1, "second export returns index 1");
    return assert;
  }),

  test("export: returns FULL when overridden", () => {
    TestExportSegment.setResult(-5);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Export);
    p.bytesVarLen(BytesBlob.zero(8));
    const resp = callRefine(p.finish());

    const assert = Assert.create();
    assert.isEqual(resp.result, -5, "export returns FULL");
    return assert;
  }),

  test("machine: incrementing machine IDs", () => {
    TestEcalli.reset();
    const p1 = Encoder.create();
    p1.varU64(EcalliIndex.Machine);
    p1.bytesVarLen(BytesBlob.zero(4));
    p1.varU64(0);
    const resp1 = callRefine(p1.finish());

    const p2 = Encoder.create();
    p2.varU64(EcalliIndex.Machine);
    p2.bytesVarLen(BytesBlob.zero(4));
    p2.varU64(0);
    const resp2 = callRefine(p2.finish());

    const assert = Assert.create();
    assert.isEqual(resp1.result, 0, "first machine returns ID 0");
    assert.isEqual(resp2.result, 1, "second machine returns ID 1");
    return assert;
  }),

  test("machine: returns HUH when overridden", () => {
    TestMachine.setMachineResult(-9);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Machine);
    p.bytesVarLen(BytesBlob.zero(4));
    p.varU64(0);
    const resp = callRefine(p.finish());

    const assert = Assert.create();
    assert.isEqual(resp.result, -9, "machine returns HUH");
    return assert;
  }),

  test("invoke: r8 carries configured value", () => {
    TestMachine.setInvokeResult(0, 42); // HALT, r8=42
    const p = Encoder.create();
    p.varU64(EcalliIndex.Invoke);
    p.varU64(0);
    p.bytesVarLen(BytesBlob.zero(8));

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "invoke returns HALT");
    // r8 = 42 encoded as u64 LE.
    const expected = Encoder.create();
    expected.u64(42);
    assert.isEqualBytes(resp.data, expected.finish(), "r8 output");
    return assert;
  }),

  test("invoke: returns WHO for unknown machine", () => {
    TestMachine.setInvokeResult(-4, 0); // WHO
    const p = Encoder.create();
    p.varU64(EcalliIndex.Invoke);
    p.varU64(99);
    p.bytesVarLen(BytesBlob.zero(8));

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, -4, "invoke returns WHO");
    return assert;
  }),

  test("historical_lookup: returns NONE when configured", () => {
    TestHistoricalLookup.setNone();
    const p = Encoder.create();
    p.varU64(EcalliIndex.HistoricalLookup);
```
