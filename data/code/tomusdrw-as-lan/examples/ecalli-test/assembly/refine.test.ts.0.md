---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.test.ts#L1-L121
title: examples/ecalli-test/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 7222ef696d278eb600a7e4a7aafa38d70ea3a084522771366150badd821ab738
language: typescript
---
`examples/ecalli-test/assembly/refine.test.ts` (lines 1–121)

```typescript
import { BytesBlob, Encoder } from "@fluffylabs/as-lan";
import {
  Assert,
  Test,
  TestEcalli,
  TestExportSegment,
  TestHistoricalLookup,
  TestMachine,
  TestStorage,
  test,
} from "@fluffylabs/as-lan/test";
import { EcalliIndex } from "./ecalli-index";
import { callRefine, strBlob } from "./test-helpers";

export const TESTS: Test[] = [
  // === General ecallis (0-5, 100) ===

  test("gas: returns remaining gas", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Gas);

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 1000000, "gas result");
    assert.isEqual(resp.data.raw.length, 0, "no output data");
    return assert;
  }),

  test("fetch: fetches work package data", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Fetch);
    p.varU64(7); // kind: WorkPackage
    p.varU64(0); // param1
    p.varU64(0); // param2
    p.varU64(0); // offset
    p.varU64(32); // maxLen

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 16, "fetch total length");
    // Stub fills 16 bytes with (kind*16 + i) & 0xFF — for kind=7 that's 0x70..0x7f.
    const expected = BytesBlob.zero(16);
    for (let i = 0; i < 16; i++) expected.raw[i] = u8((7 * 16 + i) & 0xff);
    assert.isEqualBytes(resp.data, expected, "fetched data");
    return assert;
  }),

  test("lookup: looks up preimage by hash", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Lookup);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.bytesFixLen(BytesBlob.zero(32)); // hash: zeros
    p.varU64(0); // offset
    p.varU64(256); // maxLen

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    // stub returns "test-preimage" (13 bytes)
    assert.isEqual(resp.result, 13, "lookup total length");
    assert.isEqual(resp.data.raw.length, 13, "preimage data length");
    return assert;
  }),

  test("read: returns NONE for missing key", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Read);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.bytesVarLen(strBlob("missing")); // key
    p.varU64(0); // offset
    p.varU64(8); // maxLen

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "read returns NONE");
    assert.isEqual(resp.data.raw.length, 0, "no data for missing key");
    return assert;
  }),

  test("write: stores a value, returns NONE for first write", () => {
    const p = Encoder.create();
    p.varU64(EcalliIndex.Write);
    p.bytesVarLen(strBlob("mykey")); // key
    const val = BytesBlob.parseBlob("0xcafebabe").okay!;
    p.bytesVarLen(val); // value

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "write returns NONE (no previous value)");
    return assert;
  }),

  test("read: reads back previously written value", () => {
    const val = BytesBlob.parseBlob("0xcafebabe").okay!;
    TestStorage.set(strBlob("mykey"), val);

    const p = Encoder.create();
    p.varU64(EcalliIndex.Read);
    p.varU64(u64(u32.MAX_VALUE)); // service
    p.bytesVarLen(strBlob("mykey")); // key
    p.varU64(0); // offset
    p.varU64(8); // maxLen

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 4, "read returns value length");
    assert.isEqualBytes(resp.data, val, "read data");
    return assert;
  }),

  test("write: overwrite returns previous value length", () => {
    const val = BytesBlob.parseBlob("0xcafebabe").okay!;
    TestStorage.set(strBlob("mykey"), val);

    const p = Encoder.create();
    p.varU64(EcalliIndex.Write);
    p.bytesVarLen(strBlob("mykey")); // key
    p.bytesVarLen(strBlob("newval")); // value

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 4, "write returns previous value length");
```
