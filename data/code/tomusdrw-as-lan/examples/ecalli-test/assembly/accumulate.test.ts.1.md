---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/accumulate.test.ts#L115-L239
title: examples/ecalli-test/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 7b6a2dcd110cf36a5ad39507497cf1f2fb2667e0ec26e1083ddd128b35f7cef0
language: typescript
---
`examples/ecalli-test/assembly/accumulate.test.ts` (lines 115–239)

```typescript
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "upgrade returns OK");
    return assert;
  }),

  test("transfer ecalli: transfers balance", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Transfer);
    p.varU64(100); // dest service
    p.varU64(500); // amount
    p.varU64(1000); // gas_fee
    p.bytesVarLen(BytesBlob.zero(128)); // memo

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "transfer returns OK");
    return assert;
  }),

  test("eject: removes service", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Eject);
    p.varU64(99); // service to eject
    p.bytesFixLen(BytesBlob.zero(32)); // prev_code_hash

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "eject returns OK");
    return assert;
  }),

  test("query: checks preimage status", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Query);
    p.bytesFixLen(BytesBlob.zero(32)); // hash
    p.varU64(64); // length

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "query returns NONE");
    assert.isEqual(resp.data.raw.length, 8, "query returns r8");
    return assert;
  }),

  test("solicit: requests preimage", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Solicit);
    p.bytesFixLen(BytesBlob.zero(32)); // hash
    p.varU64(64); // length

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "solicit returns OK");
    return assert;
  }),

  test("forget: cancels preimage solicitation", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Forget);
    p.bytesFixLen(BytesBlob.zero(32)); // hash
    p.varU64(64); // length

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "forget returns OK");
    return assert;
  }),

  test("yield_result: provides result hash", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.YieldResult);
    p.bytesFixLen(BytesBlob.parseBlob("0xff00000000000000000000000000000000000000000000000000000000000000").okay!);

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "yield_result returns OK");
    return assert;
  }),

  test("provide: supplies preimage", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Provide);
    p.varU64(42); // service
    const preimage = new Uint8Array(16);
    preimage[0] = 0xab;
    p.bytesVarLen(BytesBlob.wrap(preimage));

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "provide returns OK");
    return assert;
  }),

  // === Deeper verification tests ===

  test("query: r8 carries configured slot info", () => {
    // r7=100 (preimage length), r8=7 (slot1=7, slot2=0)
    TestPreimages.setQueryResult(100, 7);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Query);
    p.bytesFixLen(BytesBlob.zero(32));
    p.varU64(64);

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 100, "query returns preimage length");
    // r8 = 7 encoded as u64 LE.
    const expected = Encoder.create();
    expected.u64(7);
    assert.isEqualBytes(resp.data, expected.finish(), "r8 output");
    return assert;
  }),

  test("new_service: incrementing service IDs", () => {
    TestEcalli.reset();
    const p1 = Encoder.create();
    p1.varU64(EcalliIndex.NewService);
    p1.bytesFixLen(BytesBlob.zero(32));
    p1.varU64(1024);
    p1.varU64(100000);
    p1.varU64(50000);
    p1.varU64(0);
    p1.varU64(u64(u32.MAX_VALUE));
    const resp1 = callAccumulateWithOperand(p1.finish());

```
