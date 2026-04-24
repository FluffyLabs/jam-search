---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/accumulate.test.ts#L224-L335
title: examples/ecalli-test/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 2
chunk_total: 3
content_sha: de34b60e18c9c7ba674ca1d4b6449905a88c137d8a09001f564ce98a2ab49dc2
language: typescript
---
`examples/ecalli-test/assembly/accumulate.test.ts` (lines 224–335)

```typescript
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
    const resp1 = callAccumulateWithOperand(p1.finishRaw());

    const p2 = Encoder.create();
    p2.varU64(EcalliIndex.NewService);
    p2.bytesFixLen(BytesBlob.zero(32));
    p2.varU64(1024);
    p2.varU64(100000);
    p2.varU64(50000);
    p2.varU64(0);
    p2.varU64(u64(u32.MAX_VALUE));
    const resp2 = callAccumulateWithOperand(p2.finishRaw());

    const assert = Assert.create();
    assert.isEqual(resp1.result, 256, "first new_service returns ID 256");
    assert.isEqual(resp2.result, 257, "second new_service returns ID 257");
    return assert;
  }),

  test("bless: captures scalar arguments", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Bless);
    p.varU64(10); // manager
    p.bytesVarLen(BytesBlob.empty()); // auth_queue
    p.varU64(20); // delegator
    p.varU64(30); // registrar
    p.bytesVarLen(BytesBlob.empty()); // auto_accum
    p.varU64(5); // auto_accum_count

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "bless returns OK");
    assert.isEqual(TestPrivileged.getLastBlessManager(), 10, "manager");
    assert.isEqual(TestPrivileged.getLastBlessDelegator(), 20, "delegator");
    assert.isEqual(TestPrivileged.getLastBlessRegistrar(), 30, "registrar");
    assert.isEqual(TestPrivileged.getLastBlessAutoAccumCount(), 5, "auto_accum_count");
    return assert;
  }),

  test("assign: captures scalar arguments", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Assign);
    p.varU64(7); // core
    p.bytesVarLen(BytesBlob.empty()); // auth_queue
    p.varU64(42); // new_assigner

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "assign returns OK");
    assert.isEqual(TestPrivileged.getLastAssignCore(), 7, "core");
    assert.isEqual(TestPrivileged.getLastAssignNewAssigner(), 42, "new_assigner");
    return assert;
  }),

  test("upgrade: captures arguments", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Upgrade);
    p.bytesFixLen(BytesBlob.zero(32)); // code_hash
    p.varU64(200000); // gas
    p.varU64(100000); // allowance

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "upgrade returns OK");
    assert.isEqual(TestServices.getLastUpgradeGas(), 200000, "gas");
    assert.isEqual(TestServices.getLastUpgradeAllowance(), 100000, "allowance");
    return assert;
  }),

  test("solicit: returns HUH when configured", () => {
    TestPreimages.setSolicitResult(-9);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Solicit);
    p.bytesFixLen(BytesBlob.zero(32));
    p.varU64(64);

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -9, "solicit returns HUH");
    return assert;
  }),

  test("transfer ecalli: returns LOW when configured", () => {
    TestTransfer.setTransferResult(-1);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Transfer);
    p.varU64(100);
    p.varU64(500);
    p.varU64(1000);
    p.bytesVarLen(BytesBlob.zero(128));

    const resp = callAccumulateWithOperand(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "transfer returns LOW");
    return assert;
  }),
];
```
