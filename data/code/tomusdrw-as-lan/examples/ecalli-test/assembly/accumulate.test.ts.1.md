---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/accumulate.test.ts#L111-L231
title: examples/ecalli-test/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 1
chunk_total: 3
content_sha: 8289fc08612c432d76aa55e469df8969c6373ebaef31b54fd861772cdd61b69d
language: typescript
---
`examples/ecalli-test/assembly/accumulate.test.ts` (lines 111–231)

```typescript
    p.varU64(50000); // allowance

    const resp = callAccumulateWithOperand(p.finishRaw());
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

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "transfer returns OK");
    return assert;
  }),

  test("eject: removes service", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Eject);
    p.varU64(99); // service to eject
    p.bytesFixLen(BytesBlob.zero(32)); // prev_code_hash

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "eject returns OK");
    return assert;
  }),

  test("query: checks preimage status", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Query);
    p.bytesFixLen(BytesBlob.zero(32)); // hash
    p.varU64(64); // length

    const resp = callAccumulateWithOperand(p.finishRaw());
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

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "solicit returns OK");
    return assert;
  }),

  test("forget: cancels preimage solicitation", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Forget);
    p.bytesFixLen(BytesBlob.zero(32)); // hash
    p.varU64(64); // length

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "forget returns OK");
    return assert;
  }),

  test("yield_result: provides result hash", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.YieldResult);
    p.bytesFixLen(BytesBlob.parseBlob("0xff00000000000000000000000000000000000000000000000000000000000000").okay!);

    const resp = callAccumulateWithOperand(p.finishRaw());
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

    const resp = callAccumulateWithOperand(p.finishRaw());
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

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 100, "query returns preimage length");
    assert.isEqual(resp.data.raw.length, 8, "r8 output length");
    // r8=7 in little-endian: 0x07 0x00 ...
    assert.isEqual(resp.data.raw[0], 7, "r8 byte 0 (slot1)");
    assert.isEqual(resp.data.raw[1], 0, "r8 byte 1");
    return assert;
  }),

  test("new_service: incrementing service IDs", () => {
    TestEcalli.reset();
    const p1 = Encoder.create();
    p1.varU64(EcalliIndex.NewService);
    p1.bytesFixLen(BytesBlob.zero(32));
```
