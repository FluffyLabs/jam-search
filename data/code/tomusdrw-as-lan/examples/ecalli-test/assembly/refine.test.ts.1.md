---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.test.ts#L114-L235
title: examples/ecalli-test/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 908276ac707b433ab24c3c28f75c13a504222991509d96e59bdf3806afced5d8
language: typescript
---
`examples/ecalli-test/assembly/refine.test.ts` (lines 114–235)

```typescript
  test("write: overwrite returns previous value length", () => {
    const val = BytesBlob.parseBlob("0xcafebabe").okay!;
    TestStorage.set(strBlob("mykey"), val);

    const p = Encoder.create();
    p.varU64(EcalliIndex.Write);
    p.bytesVarLen(strBlob("mykey")); // key
    p.bytesVarLen(strBlob("newval")); // value

    const resp = callRefine(p.finishRaw());
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

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 96, "info total length");
    assert.isEqual(resp.data.raw.length, 96, "info data length");
    assert.isEqual(resp.data.raw[0], 0xaa, "code_hash[0]");
    assert.isEqual(resp.data.raw[31], 0xaa, "code_hash[31]");
    assert.isEqual(resp.data.raw[32], 0xe8, "balance[0]");
    assert.isEqual(resp.data.raw[33], 0x03, "balance[1]");
    return assert;
  }),

  test("log: emits a debug message", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Log);
    p.varU64(2); // level: Important
    p.bytesVarLen(strBlob("test-target"));
    p.bytesVarLen(strBlob("hello from test"));

    const resp = callRefine(p.finishRaw());
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

    const resp = callRefine(p.finishRaw());
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

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "export returns segment index 0");
    return assert;
  }),

  test("machine: creates inner PVM", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Machine);
    p.bytesVarLen(BytesBlob.zero(4));
    p.varU64(0); // entrypoint

    const resp = callRefine(p.finishRaw());
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

    const resp = callRefine(p.finishRaw());
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

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "poke returns OK");
    return assert;
  }),

  test("pages: sets inner machine page access", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Pages);
    p.varU64(0); // machine_id
```
