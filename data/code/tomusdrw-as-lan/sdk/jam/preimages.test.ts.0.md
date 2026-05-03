---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/preimages.test.ts#L1-L112'
title: sdk/jam/preimages.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 21a55076c8cdc4c91782fec59f657255d463874f95fb27d814fc3102bd61e1e7
language: typescript
---
`sdk/jam/preimages.test.ts` (lines 1–112)

```typescript
import { Bytes32, BytesBlob } from "../core/bytes";
import { EcalliResult } from "../ecalli";
import { TestEcalli, TestHistoricalLookup, TestLookup, TestPreimages } from "../test/test-ecalli";
import { Assert, Test, test } from "../test/utils";
import { AccumulatePreimages, ForgetError, ProvideError, SolicitError } from "./accumulate/preimages";
import { PreimageStatusKind, Preimages } from "./preimages";
import { RefinePreimages } from "./refine/preimages";

export const TESTS: Test[] = [
  // ─── Preimages.lookup ─────────────────────────────────────────────────

  test("Preimages.lookup returns BytesBlob", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const data = BytesBlob.parseBlob("0xdeadbeef").okay!;
    TestLookup.setPreimage(data.raw);

    const p = Preimages.create();
    const result = p.lookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.length, 4, "length");
    a.isEqual(result.val!.raw[0], 0xde, "byte 0");
    a.isEqual(result.val!.raw[3], 0xef, "byte 3");
    return a;
  }),

  test("Preimages.lookup returns none when NONE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestLookup.setNone();

    const p = Preimages.create();
    const result = p.lookup(Bytes32.zero());
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  test("Preimages.lookup auto-expands buffer", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const large = BytesBlob.zero(2048);
    for (let i = 0; i < 2048; i++) large.raw[i] = u8(i & 0xff);
    TestLookup.setPreimage(large.raw);

    // Small buffer forces auto-expansion
    const p = Preimages.create(64);
    const result = p.lookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.length, 2048, "length");
    a.isEqual(result.val!.raw[0], 0, "byte 0");
    a.isEqual(result.val!.raw[255], 255, "byte 255");
    return a;
  }),

  // ─── RefinePreimages.lookup (delegation) ──────────────────────────────

  test("RefinePreimages.lookup delegates to Preimages", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const data = BytesBlob.parseBlob("0xcafe").okay!;
    TestLookup.setPreimage(data.raw);

    const rp = RefinePreimages.create();
    const result = rp.lookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.length, 2, "length");
    a.isEqual(result.val!.raw[0], 0xca, "byte 0");
    return a;
  }),

  // ─── RefinePreimages.historicalLookup ─────────────────────────────────

  test("RefinePreimages.historicalLookup returns BytesBlob", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const data = BytesBlob.parseBlob("0xaabbccdd").okay!;
    TestHistoricalLookup.setPreimage(data.raw);

    const rp = RefinePreimages.create();
    const result = rp.historicalLookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.length, 4, "length");
    a.isEqual(result.val!.raw[0], 0xaa, "byte 0");
    a.isEqual(result.val!.raw[3], 0xdd, "byte 3");
    return a;
  }),

  test("RefinePreimages.historicalLookup returns none when NONE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestHistoricalLookup.setNone();

    const rp = RefinePreimages.create();
    const result = rp.historicalLookup(Bytes32.zero());
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  // ─── AccumulatePreimages.query ────────────────────────────────────────

  test("AccumulatePreimages.query returns none for NONE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Default mock returns NONE
    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  test("AccumulatePreimages.query decodes Requested", () => {
    TestEcalli.reset();
```
