---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.test.ts#L117-L243
title: examples/ecalli-test/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 1
chunk_total: 4
content_sha: d86a58a21990c439350cbc754aff7c27e2fbf3c2b0a67718c88f4160bb80a6ca
language: typescript
---
`examples/ecalli-test/assembly/refine.test.ts` (lines 117–243)

```typescript
    p.bytesVarLen(strBlob("newval")); // value

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 4, "write returns previous value length");
    return assert;
  }),

  test("info: returns 96-byte service info", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Info);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.varU64(0); // offset
    p.varU64(96); // maxLen

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 96, "info total length");
    // Stub returns: code_hash = 32 × 0xAA, balance = 1000 (0x03e8) LE u64, rest = 0.
    const expected = BytesBlob.zero(96);
    expected.raw.fill(0xaa, 0, 32);
    expected.raw[32] = 0xe8;
    expected.raw[33] = 0x03;
    assert.isEqualBytes(resp.data, expected, "info data");
    return assert;
  }),

  test("log: emits a debug message", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Log);
    p.varU64(2); // level: Important
    p.bytesVarLen(strBlob("test-target"));
    p.bytesVarLen(strBlob("hello from test"));

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "log returns 0");
    return assert;
  }),

  // === Refine ecallis (6-13) ===

  test("historical_lookup: returns historical preimage", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.HistoricalLookup);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.bytesFixLen(BytesBlob.zero(32)); // hash: zeros
    p.varU64(0); // offset
    p.varU64(256); // maxLen

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 15, "historical_lookup total length");
    assert.isEqual(resp.data.raw.length, 15, "preimage data length");
    return assert;
  }),

  test("export: exports a segment", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Export);
    const segment = BytesBlob.zero(8);
    segment.raw[0] = 0x42;
    p.bytesVarLen(segment);

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "export returns segment index 0");
    return assert;
  }),

  test("machine: creates inner PVM", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Machine);
    p.bytesVarLen(BytesBlob.zero(4));
    p.varU64(0); // entrypoint

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "machine returns machine ID 0");
    return assert;
  }),

  test("peek: reads from inner machine memory", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Peek);
    p.varU64(0); // machine_id
    p.varU64(0); // source address
    p.varU64(8); // length

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "peek returns OK");
    assert.isEqual(resp.data.raw.length, 8, "peek data length");
    return assert;
  }),

  test("poke: writes to inner machine memory", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Poke);
    p.varU64(0); // machine_id
    const data = BytesBlob.zero(4);
    data.raw[0] = 0xde;
    data.raw[1] = 0xad;
    p.bytesVarLen(data);
    p.varU64(0x1000); // dest address in machine

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "poke returns OK");
    return assert;
  }),

  test("pages: sets inner machine page access", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Pages);
    p.varU64(0); // machine_id
    p.varU64(0); // start_page
    p.varU64(1); // page_count
    p.varU64(3); // access_type (read+write)

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "pages returns OK");
    return assert;
  }),

  test("invoke: runs inner PVM machine", () => {
```
