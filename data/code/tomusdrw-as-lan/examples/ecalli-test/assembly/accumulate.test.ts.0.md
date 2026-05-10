---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/accumulate.test.ts#L1-L121
title: examples/ecalli-test/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 07fbbd328b37bbf7a2bc3330d02d2c44235ee023d33549591b3fe0f41f3b983e
language: typescript
---
`examples/ecalli-test/assembly/accumulate.test.ts` (lines 1–121)

```typescript
import { AccumulateContext, BytesBlob, Decoder, Encoder } from "@fluffylabs/as-lan";
import {
  Assert,
  Test,
  TestAccumulate,
  TestEcalli,
  TestPreimages,
  TestPrivileged,
  TestServices,
  TestTransfer,
  test,
} from "@fluffylabs/as-lan/test";
import { EcalliIndex } from "./ecalli-index";
import { buildTransferItem, callAccumulate, callAccumulateWithOperand } from "./test-helpers";

export const TESTS: Test[] = [
  // === Accumulate: transfer processing ===

  test("accumulate: receives transfer", () => {
    const item = buildTransferItem(99, 42, 500, 10000);
    TestAccumulate.setItem(0, item);
    const raw = callAccumulate(1);
    const accCtx = AccumulateContext.create();
    const resp = accCtx.response.decode(Decoder.fromBytesBlob(raw)).okay!;
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "transfer result OK");
    // Transfer data is re-encoded as: source(u32) + dest(u32) + amount(u64) + gas(u64).
    const expected = Encoder.create();
    expected.u32(99);
    expected.u32(42);
    expected.u64(500);
    expected.u64(10000);
    assert.isEqualBytes(resp.data, expected.finish(), "transfer payload");
    return assert;
  }),

  // === Accumulate: operand ecalli dispatch (14-26) ===
  // Each test sets up a mock operand whose okBlob contains the ecalli payload,
  // then calls accumulate which fetches the item and dispatches.

  test("bless: sets privileged config", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Bless);
    p.varU64(1); // manager
    p.bytesVarLen(BytesBlob.empty()); // auth_queue
    p.varU64(2); // delegator
    p.varU64(3); // registrar
    p.bytesVarLen(BytesBlob.empty()); // auto_accum
    p.varU64(0); // auto_accum_count

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "bless returns OK");
    return assert;
  }),

  test("assign: assigns core", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Assign);
    p.varU64(0); // core
    p.bytesVarLen(BytesBlob.empty()); // auth_queue
    p.varU64(1); // assigners

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "assign returns OK");
    return assert;
  }),

  test("designate: sets next epoch validators", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Designate);
    p.bytesVarLen(BytesBlob.empty()); // validators

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "designate returns OK");
    return assert;
  }),

  test("checkpoint: commits state", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Checkpoint);

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 1000000, "checkpoint returns gas");
    return assert;
  }),

  test("new_service: creates new service", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.NewService);
    p.bytesFixLen(BytesBlob.zero(32)); // code_hash
    p.varU64(1024); // code_len
    p.varU64(100000); // gas
    p.varU64(50000); // allowance
    p.varU64(0); // gratis_storage
    p.varU64(u64(u32.MAX_VALUE)); // requested_id (auto)

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 256, "new_service returns service ID 256");
    return assert;
  }),

  test("upgrade: upgrades service code", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Upgrade);
    p.bytesFixLen(BytesBlob.zero(32)); // code_hash
    p.varU64(100000); // gas
    p.varU64(50000); // allowance

    const resp = callAccumulateWithOperand(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "upgrade returns OK");
    return assert;
  }),

  test("transfer ecalli: transfers balance", () => {
    const p = Encoder.create();
```
